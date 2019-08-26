# Import required modules
import cv2 as cv
import numpy as np
import argparse
import time
import face_recognition
import pickle
from multiprocessing import Process, Manager, cpu_count
from utils.realsense import realsense, rsOptions
from utils.argument import str2bool
from utils.save import saveResult
from utils.draw import drawRecognition
from utils.faceMatch import faceMatch

############ Add argument parser for command line arguments ############
parser = argparse.ArgumentParser(
    description="Face recognition demo with OpenCV, dlib and face_recognition libraries."
)
parser.add_argument(
    "--scale", type=float, default=0.5, help="scale factor of input image pre-resize."
)
parser.add_argument(
    "--threshold",
    type=float,
    default=0.6,
    help="distance threshold for face recognition.",
)
parser.add_argument(
    "--pickle",
    type=str,
    default="./pickle/face.pickle",
    help="path to input pickle of faces",
)
parser.add_argument(
    "--skip",
    type=str2bool,
    nargs="?",
    const=True,
    default=False,
    help="Toggle of process face detection frame by frame.",
)
parser.add_argument(
    "--info",
    type=str2bool,
    nargs="?",
    const=True,
    default=False,
    help="Toggle of display information in images.",
)
args = parser.parse_args()

# Get next worker's id
def next_id(current_id):
    if current_id == worker_num:
        return 1
    else:
        return current_id + 1


# Get previous worker's id
def prev_id(current_id):
    if current_id == 1:
        return worker_num
    else:
        return current_id - 1


# A subprocess use to capture frames.
def capture(read_frame_list):
    # Start RealSense Camera
    options = rsOptions()
    options.enableColor = True
    options.resColor = [1280, 720]
    rs = realsense(options)
    rs.deviceInitial()

    while not Global.is_exit:
        # If it's time to read a frame
        if Global.buff_num != next_id(Global.read_num):
            # Grab a single frame of video
            rs.getFrame()
            frame = rs.imageColor
            read_frame_list[Global.buff_num] = frame
            Global.buff_num = next_id(Global.buff_num)
        else:
            time.sleep(0.01)

    # Release webcam
    rs.pipeline.stop()


# Many subprocess use to process frames.
def process(worker_id, read_frame_list, write_frame_list):
    known_face_encodings = Global.known_face_encodings
    known_face_names = Global.known_face_names
    while not Global.is_exit:

        # Wait to read
        while Global.read_num != worker_id or Global.read_num != prev_id(
            Global.buff_num
        ):
            time.sleep(0.01)

        # Delay to make the video look smoother
        time.sleep(Global.frame_delay)

        # Read a single frame from frame list
        frame_process = read_frame_list[worker_id]

        # Expect next worker to read frame
        Global.read_num = next_id(Global.read_num)

        # Convert the image from BGR color (which OpenCV uses) to RGB color (which face_recognition uses)
        rgb_frame = frame_process[:, :, ::-1]

        # Find all the faces and face encodings in the frame of video, cost most time
        face_locations = face_recognition.face_locations(rgb_frame)
        face_encodings = face_recognition.face_encodings(rgb_frame, face_locations)

        # Loop through each face in this frame of video
        for (top, right, bottom, left), face_encoding in zip(
            face_locations, face_encodings
        ):
            # See if the face is a match for the known face(s)
            matches = face_recognition.compare_faces(
                known_face_encodings, face_encoding
            )

            name = "Unknown"

            # If a match was found in known_face_encodings, just use the first one.
            if True in matches:
                first_match_index = matches.index(True)
                name = known_face_names[first_match_index]

            # Draw a box around the face
            cv.rectangle(frame_process, (left, top), (right, bottom), (0, 0, 255), 2)

            # Draw a label with a name below the face
            cv.rectangle(
                frame_process,
                (left, bottom - 35),
                (right, bottom),
                (0, 0, 255),
                cv.FILLED,
            )
            font = cv.FONT_HERSHEY_DUPLEX
            cv.putText(
                frame_process,
                name,
                (left + 6, bottom - 6),
                font,
                1.0,
                (255, 255, 255),
                1,
            )

        # Wait to write
        while Global.write_num != worker_id:
            time.sleep(0.01)

        # Send frame to global
        write_frame_list[worker_id] = frame_process

        # Expect next worker to write frame
        Global.write_num = next_id(Global.write_num)


if __name__ == "__main__":
    # Global variables
    Global = Manager().Namespace()
    Global.buff_num = 1
    Global.read_num = 1
    Global.write_num = 1
    Global.frame_delay = 0
    Global.is_exit = False
    read_frame_list = Manager().dict()
    write_frame_list = Manager().dict()

    # Number of workers (subprocess use to process frames)
    worker_num = cpu_count()

    # Subprocess list
    p = []

    # Create a subprocess to capture frames
    p.append(Process(target=capture, args=(read_frame_list,)))
    p[0].start()

    # load learned faces
    print("[INFO] loading faces ...")
    # check the image source comes from
    print("[INFO] faces loaded from {} ...".format(args.pickle))
    data = pickle.loads(open(args.pickle, "rb").read())

    Global.known_face_encodings = data["embeddings"]
    Global.known_face_names = data["names"]

    # Create workers
    for worker_id in range(1, worker_num + 1):
        p.append(
            Process(target=process, args=(worker_id, read_frame_list, write_frame_list))
        )
        p[worker_id].start()

    # Start to show video
    last_num = 1
    fps_list = []
    tmp_time = time.time()

    while not Global.is_exit:
        while Global.write_num != last_num:
            last_num = int(Global.write_num)

            # Calculate fps
            delay = time.time() - tmp_time
            tmp_time = time.time()
            fps_list.append(delay)
            if len(fps_list) > 5 * worker_num:
                fps_list.pop(0)
            fps = len(fps_list) / np.sum(fps_list)
            print("fps: %.2f" % fps)

            # Calculate frame delay, in order to make the video look smoother.
            # When fps is higher, should use a smaller ratio, or fps will be limited in a lower value.
            # Larger ratio can make the video look smoother, but fps will hard to become higher.
            # Smaller ratio can make fps higher, but the video looks not too smoother.
            # The ratios below are tested many times.
            if fps < 6:
                Global.frame_delay = (1 / fps) * 0.75
            elif fps < 20:
                Global.frame_delay = (1 / fps) * 0.5
            elif fps < 30:
                Global.frame_delay = (1 / fps) * 0.25
            else:
                Global.frame_delay = 0

            # Display the resulting image
            cv.imshow(
                "Face recognition demo", write_frame_list[prev_id(Global.write_num)]
            )

        # Hit 'q' on the keyboard to quit!
        if cv.waitKey(1) & 0xFF == ord("q"):
            Global.is_exit = True
            break

        time.sleep(0.01)

    # Quit
    cv.destroyAllWindows()

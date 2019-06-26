# Import required modules
import cv2 as cv
import numpy as np
import math
import argparse
import time
import face_recognition
import pickle
from utils.realsense import realsense, rsOptions
from utils.utilarg import str2bool

############ Add argument parser for command line arguments ############
parser = argparse.ArgumentParser(
    description="Face recognition demo with OpenCV, dlib and face_recognition libraries."
)
parser.add_argument(
    "--scale", type=float, default=0.5, help="scale factor of input image pre-resize."
)
parser.add_argument(
    "--pickle", type=str, default="face.pickle", help="path to input pickle of faces"
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


def main():
    # load learned faces
    print("[INFO] loading faces ...")
    # check the image source comes from
    print("[INFO] faces loaded from {} ...".format(args.pickle))
    data = pickle.loads(open(args.pickle, "rb").read())

    # Initialize some variables
    face_locations = []
    process_this_frame = True
    flagCapture = False

    # Create a new named window
    kWinName = "Face recognition demo"

    # Start RealSense Camera
    options = rsOptions()
    options.enableColor = True
    rs = realsense(options)
    rs.deviceInitial()

    try:
        while True:
            # Save program start time
            if args.skip is True:
                if process_this_frame:
                    start_time = time.time()
            else:
                start_time = time.time()

            # Read frame
            rs.getFrame()
            frame = rs.imageColor
            if not frame.any():
                cv.waitKey()
                break

            # Resize frame of video to 1/2 size for faster face recognition processing
            small_frame = cv.resize(frame, (0, 0), fx=args.scale, fy=args.scale)

            # Convert the image from BGR color (which OpenCV uses) to RGB color (which face_recognition uses)
            rgb_small_frame = small_frame[:, :, ::-1]

            if args.skip is True:
                # Only process every other frame of video to save time
                if process_this_frame:
                    # Find all the faces and face encodings in the current frame of video
                    face_locations = face_recognition.face_locations(rgb_small_frame)
                    face_encodings = face_recognition.face_encodings(
                        rgb_small_frame, face_locations
                    )

                    face_names = []
                    for face_encoding in face_encodings:
                        # See if the face is a match for the known face(s)
                        matches = face_recognition.compare_faces(
                            data["embeddings"], face_encoding
                        )
                        name = "Unknown"

                        # # If a match was found in known_face_encodings, just use the first one.
                        # if True in matches:
                        #     first_match_index = matches.index(True)
                        #     name = known_face_names[first_match_index]

                        # Or instead, use the known face with the smallest distance to the new face
                        face_distances = face_recognition.face_distance(
                            data["embeddings"], face_encoding
                        )
                        best_match_index = np.argmin(face_distances)
                        if matches[best_match_index]:
                            name = data["names"][best_match_index]

                        face_names.append(name)
                process_this_frame = not process_this_frame
            else:
                face_locations = face_recognition.face_locations(rgb_small_frame)
                face_encodings = face_recognition.face_encodings(
                    rgb_small_frame, face_locations
                )

            face_names = []
            for face_encoding in face_encodings:
                # See if the face is a match for the known face(s)
                matches = face_recognition.compare_faces(
                    data["embeddings"], face_encoding
                )
                name = "Unknown"

                # # If a match was found in known_face_encodings, just use the first one.
                # if True in matches:
                #     first_match_index = matches.index(True)
                #     name = known_face_names[first_match_index]

                # Or instead, use the known face with the smallest distance to the new face
                face_distances = face_recognition.face_distance(
                    data["embeddings"], face_encoding
                )
                best_match_index = np.argmin(face_distances)
                if matches[best_match_index]:
                    name = data["names"][best_match_index]

                face_names.append(name)

            # Display the results
            for (top, right, bottom, left), name in zip(face_locations, face_names):
                # Scale back up face locations since the frame we detected in was scaled to 1/2 size
                top *= 2
                right *= 2
                bottom *= 2
                left *= 2

                # Draw a box around the face
                cv.rectangle(frame, (left, top), (right, bottom), (0, 255, 0), 2)

                # Draw a label with a name below the face
                cv.rectangle(
                    frame, (left, bottom - 15), (right, bottom), (255, 0, 0), cv.FILLED
                )
                cv.putText(
                    frame,
                    name,
                    (left, bottom),
                    cv.FONT_HERSHEY_SIMPLEX,
                    0.5,
                    (255, 255, 255),
                    1,
                )

            # Calculate processing time
            if args.skip is True:
                if not process_this_frame:
                    label = "Process time: %.2f ms" % ((time.time() - start_time) * 500)
            else:
                label = "Process time: %.2f ms" % ((time.time() - start_time) * 1000)
            if args.info is True:
                if not process_this_frame:
                    print("[INFO] " + label)
                cv.putText(
                    frame, label, (0, 30), cv.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 255)
                )

            # Display the frame
            cv.imshow(kWinName, frame)

            # Process screen capture
            if flagCapture:
                print("Screen captured")
                fileName = (
                    "Screen_"
                    + time.strftime("%Y-%m-%d_%H%M%S-", time.localtime())
                    + ".png"
                )
                cv.imwrite(fileName, frame, [int(cv.IMWRITE_PNG_COMPRESSION), 0])
                flagCapture = False

            # Keyboard commands
            getKey = cv.waitKey(1) & 0xFF
            if getKey is ord("c") or getKey is ord("C"):
                flagCapture = True
            elif getKey is ord("q") or getKey is ord("Q"):
                break

    except Exception as e:
        print(e)
        pass

    finally:
        # Stop streaming
        cv.destroyAllWindows()
        rs.pipeline.stop()


if __name__ == "__main__":
    main()

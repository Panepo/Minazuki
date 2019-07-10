# Import required modules
import cv2 as cv
import argparse
import time
import face_recognition
import pickle
from utils.argument import str2bool
from utils.save import saveResult
from utils.draw import drawResult
from utils.faceMatch import faceMatch

############ Add argument parser for command line arguments ############
parser = argparse.ArgumentParser(
    description="Face recognition demo with OpenCV, dlib and face_recognition libraries."
)
parser.add_argument(
    "--input",
    help="Path to input image or video file. Skip this argument to capture frames from a camera.",
)
parser.add_argument(
    "--scale", type=float, default=0.5, help="scale factor of input image pre-resize."
)
parser.add_argument(
    "--threshold", type=float, default=0.6, help="distance threshold for face recognition."
)
parser.add_argument(
    "--pickle", type=str, default="./pickle/face.pickle", help="path to input pickle of faces"
)
parser.add_argument(
    "--save",
    type=str2bool,
    nargs="?",
    const=True,
    default=False,
    help="Toggle of save the generated image.",
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

    # Create a new named window
    kWinName = "Face recognition demo"

    # Open a video file or an image file or a camera stream
    cap = cv.VideoCapture(args.input if args.input else 0)

    while cv.waitKey(1) < 0:
        # Save program start time
        start_time = time.time()

        # Read frame
        hasFrame, frame = cap.read()
        if not hasFrame:
            cv.waitKey()
            break

        # Resize frame of video to 1/2 size for faster face recognition processing
        small_frame = cv.resize(frame, (0, 0), fx=args.scale, fy=args.scale)

        # Convert the image from BGR color (which OpenCV uses) to RGB color (which face_recognition uses)
        rgb_small_frame = small_frame[:, :, ::-1]

        if args.skip:
            # Only process every other frame of video to save time
            if process_this_frame:
                face_locations, face_names = faceMatch(rgb_small_frame, data, args.threshold)
            process_this_frame = not process_this_frame
        else:
            face_locations, face_names = faceMatch(rgb_small_frame, data, args.threshold)

        # Display the results
        drawResult(frame, face_locations, face_names, args.scale)

        # Calculate processing time
        label = "Process time: %.2f ms" % ((time.time() - start_time) * 1000)
        print("[INFO] " + label)
        if args.info:
            cv.putText(
                frame, label, (0, 30), cv.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 255)
            )

        # Display the frame
        cv.imshow(kWinName, frame)

        # Save results
        if args.save and args.input:
            saveResult(frame, 'recognition')

    # Release handle to the webcam
    cap.release()
    cv.destroyAllWindows()


if __name__ == "__main__":
    main()

# Import required modules
import cv2 as cv
import numpy as np
import math
import argparse
import time
import face_recognition
import pickle
from sklearn import svm
from utils.argument import str2bool
from utils.save import saveResult
from utils.draw import drawRecognition

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
    "--svm", type=str, default="./pickle/face_svm.pickle", help="path to SVM model"
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
    # load svm model
    print("[INFO] loading SVM model ...")
    print("[INFO] SVM model from {} ...".format(args.svm))
    clf = pickle.loads(open(args.svm, "rb").read())

    # Initialize some variables
    face_locations = []
    process_this_frame = True

    # Create a new named window
    kWinName = "Face recognition demo with SVM classifier"

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
                # Find all the faces and face encodings in the current frame of video
                face_locations = face_recognition.face_locations(rgb_small_frame)
                face_encodings = face_recognition.face_encodings(
                    rgb_small_frame, face_locations
                )

                face_names = []
                for face_encoding in face_encodings:
                    # predict face by SVM
                    name = clf.predict([face_encoding])
                    face_names.append(name[0])

            process_this_frame = not process_this_frame
        else:
            face_locations = face_recognition.face_locations(rgb_small_frame)
            face_encodings = face_recognition.face_encodings(
                rgb_small_frame, face_locations
            )

            face_names = []
            for face_encoding in face_encodings:
                # predict face by SVM
                name = clf.predict([face_encoding])
                face_names.append(name[0])

        # Display the results
        drawRecognition(frame, face_locations, face_names, args.scale)

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
            saveResult(frame, "recognition_svm")

    # Release handle to the webcam
    cap.release()
    cv.destroyAllWindows()


if __name__ == "__main__":
    main()

# Import required modules
import cv2 as cv
import numpy as np
import math
import argparse
import time
import face_recognition
import pickle
from sklearn import neighbors
from utils.argument import str2bool

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
    "--knn", type=str, default="face_knn.pickle", help="path to KNN model"
)
parser.add_argument(
    "--threshold", type=float, default=0.6, help="distance threshold for face recognition."
)
parser.add_argument(
    "--pickle", type=str, default="face.pickle", help="path to input pickle of faces"
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

    # load svm model
    print("[INFO] loading KNN model ...")
    print("[INFO] KNN model from {} ...".format(args.knn))
    knn_clf = pickle.loads(open(args.knn, "rb").read())

    # Initialize some variables
    face_locations = []
    process_this_frame = True

    # Create a new named window
    kWinName = "Face recognition demo with KNN classifier"

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

                closest_distances = knn_clf.kneighbors(face_encodings, n_neighbors=1)
                face_names = []
                for i in range(len(face_locations)):
                    if closest_distances[0][i][0] <= args.threshold:
                        best_match_index = closest_distances[1][i][0]
                        name = data["names"][best_match_index]
                    else:
                        name = "Unknown"
                    face_names.append(name)

            process_this_frame = not process_this_frame
        else:
            face_locations = face_recognition.face_locations(rgb_small_frame)
            face_encodings = face_recognition.face_encodings(
                rgb_small_frame, face_locations
            )

            closest_distances = knn_clf.kneighbors(face_encodings, n_neighbors=1)
            face_names = []
            for i in range(len(face_locations)):
                if closest_distances[0][i][0] <= args.threshold:
                    best_match_index = closest_distances[1][i][0]
                    name = data["names"][best_match_index]
                else:
                    name = "Unknown"
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
            fileName = (
                "Output_" + time.strftime("%Y-%m-%d_%H%M%S-", time.localtime()) + ".png"
            )
            cv.imwrite(fileName, frame, [int(cv.IMWRITE_PNG_COMPRESSION), 0])

    # Release handle to the webcam
    cap.release()
    cv.destroyAllWindows()


if __name__ == "__main__":
    main()

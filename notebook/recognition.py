# Import required modules
import cv2 as cv
import numpy as np
import math
import argparse
import time
import face_recognition
import os
import pickle
from utils.path import list_images, list_images_dirs

############ Add argument parser for command line arguments ############
parser = argparse.ArgumentParser(
    description="Face recognition demo with OpenCV, dlib and face_recognition libraries."
)
parser.add_argument(
    "--input",
    help="Path to input image or video file. Skip this argument to capture frames from a camera.",
)
parser.add_argument(
    "--source",
    type=bool,
    default=True,
    help="Toggle of the source data comes from: if True will read face.pickle, if not will read images.",
)
parser.add_argument(
    "--pickle", type=str, default="face.pickle", help="path to input pickle of faces"
)
parser.add_argument(
    "--dataset",
    type=str,
    default="../server/data/",
    help="path to input directory of faces + images",
)
parser.add_argument(
    "--embeddings",
    type=str,
    default="face.pickle",
    help="path to output serialized db of facial embeddings",
)
parser.add_argument("--save", type=bool, help="Toggle of save the generated image.")
parser.add_argument(
    "--skip",
    type=bool,
    default=True,
    help="Toggle of process face detection frame by frame.",
)
args = parser.parse_args()


def readDataSet():
    # grab the paths to the input images in our dataset
    print("[INFO] quantifying faces...")
    imagePaths = list(list_images(args.dataset))

    # initialize our lists of extracted facial embeddings and
    # corresponding people names
    knownNames = list(list_images_dirs(args.dataset))
    knownEmbeddings = []

    # initialize the total number of faces processed
    total = 0

    for (i, imagePath) in enumerate(imagePaths):
        # extract the person name from the image path
        print("[INFO] processing image {}/{}".format(i + 1, len(imagePaths)))
        temp_image = face_recognition.load_image_file(imagePath)
        temp_face_encoding = face_recognition.face_encodings(temp_image)[0]
        knownEmbeddings.append(temp_face_encoding)
        total += 1

    # dump the facial embeddings + names to disk
    print("[INFO] serializing {} encodings...".format(total))
    data = {"embeddings": knownEmbeddings, "names": knownNames}
    f = open(args.embeddings, "wb")
    f.write(pickle.dumps(data))
    f.close()


def main():
    # load learned faces
    print("[INFO] loading faces ...")
    # check the image source comes from
    if args.source:
        print("[INFO] faces loaded from {} ...".format(args.pickle))
        data = pickle.loads(open(args.pickle, "rb").read())
    else:
        print("[INFO] faces loaded from hard disk images ...")
        readDataSet()

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

        # Resize frame of video to 1/4 size for faster face recognition processing
        small_frame = cv.resize(frame, (0, 0), fx=0.5, fy=0.5)

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

        # Display the results
        for (top, right, bottom, left), name in zip(face_locations, face_names):
            # Scale back up face locations since the frame we detected in was scaled to 1/4 size
            top *= 2
            right *= 2
            bottom *= 2
            left *= 2

            # Draw a box around the face
            cv.rectangle(frame, (left, top), (right, bottom), (0, 255, 0), 2)

            # Draw a label with a name below the face
            cv.rectangle(frame, (left, bottom - 15), (right, bottom), (255, 0, 0), cv.FILLED)
            cv.putText(frame, name, (left, bottom), cv.FONT_HERSHEY_SIMPLEX, 0.5, (255, 255, 255), 1)

        # Calculate processing time
        label = "Process time: %.2f ms" % ((time.time() - start_time) * 1000)
        cv.putText(frame, label, (0, 30), cv.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 255))

        # Display the frame
        cv.imshow(kWinName, frame)

        # Save results
        if args.save:
            fileName = (
                "Output_" + time.strftime("%Y-%m-%d_%H%M%S-", time.localtime()) + ".png"
            )
            cv.imwrite(fileName, frame, [int(cv.IMWRITE_PNG_COMPRESSION), 0])

    # Release handle to the webcam
    cap.release()
    cv.destroyAllWindows()


if __name__ == "__main__":
    main()

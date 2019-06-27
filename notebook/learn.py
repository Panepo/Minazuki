# Import required modules
import pickle
import argparse
import face_recognition
import time
from utils.path import list_images, list_images_dirs
from utils.argument import str2bool
from utils.time import transTime

############ Add argument parser for command line arguments ############
parser = argparse.ArgumentParser(
    description="Learn faces to generate compressed pickle file."
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
parser.add_argument(
    "--errors", type=str, default="error.txt", help="path to output error face lists."
)
parser.add_argument(
    "--detection",
    type=str2bool,
    nargs="?",
    const=True,
    default=False,
    help="Toggle of perform face detection first.",
)
args = parser.parse_args()


def main():
    # get start time
    start_time = time.time()

    # grab the paths to the input images in our dataset
    print("[INFO] quantifying faces...")
    imagePaths = list(list_images(args.dataset))

    # initialize our lists of extracted facial embeddings and
    # corresponding people names
    knownNames = list(list_images_dirs(args.dataset))
    knownEmbeddings = []

    # initialize the total number of faces processed
    total = 0

    # initialize error lists
    error = []

    for (i, imagePath) in enumerate(imagePaths):
        # extract the person name from the image path
        print("[INFO] processing image {}/{}".format(i + 1, len(imagePaths)))
        image = face_recognition.load_image_file(imagePath)

        if args.detection is True:
            face_locations = face_recognition.face_locations(image)
            face_encodings = face_recognition.face_encodings(image, face_locations)
        else:
            face_encodings = face_recognition.face_encodings(image)

        if len(face_encodings) > 0:
            temp_face_encoding = face_encodings[0]
        else:
            print("[ERROR] no face found in image {}".format(imagePath))
            del knownNames[i]
            error.append(imagePath)
            continue

        knownEmbeddings.append(temp_face_encoding)
        total += 1

    # dump the facial embeddings + names to disk
    print("[INFO] serializing {} encodings...".format(total))
    data = {"embeddings": knownEmbeddings, "names": knownNames}
    with open(args.embeddings, "wb") as f:
        f.write(pickle.dumps(data))
        f.close()
        print("[INFO] face embeddings {} saved".format(args.embeddings))

    # display error list
    if len(error) > 0:
        print("[INFO] total {} error images".format(len(error)))
        with open(args.errors, "w", encoding="utf-8") as f:
            for item in error:
                f.write("%s\n" % item)
            f.close()
            print("[INFO] error lists {} saved".format(args.errors))

    # calculate processing time
    tick = (time.time() - start_time) * 1000
    transTime(tick, "[INFO] Total process time: ")


if __name__ == "__main__":
    main()

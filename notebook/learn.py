# Import required modules
import pickle
import argparse
import face_recognition
import time
from utils.path import list_images, list_images_dirs
from utils.utilarg import str2bool
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

    for (i, imagePath) in enumerate(imagePaths):
        # extract the person name from the image path
        print("[INFO] processing image {}/{}".format(i + 1, len(imagePaths)))
        temp_image = face_recognition.load_image_file(imagePath)

        if args.detection is True:
            temp_face_locations = face_recognition.face_locations(temp_image)
            temp_face_encoding = face_recognition.face_encodings(temp_image, temp_face_locations)[0]
        else:
            temp_face_encoding = face_recognition.face_encodings(temp_image)[0]

        knownEmbeddings.append(temp_face_encoding)
        total += 1

    # dump the facial embeddings + names to disk
    print("[INFO] serializing {} encodings...".format(total))
    data = {"embeddings": knownEmbeddings, "names": knownNames}

    with open(args.embeddings, "wb") as f:
        f.write(pickle.dumps(data))
        f.close()
        print("[INFO] face embeddings {} saved".format(args.embeddings))

    # Calculate processing time
    tick = ((time.time() - start_time) * 1000)
    transTime(tick, "[INFO] Total process time: ")

if __name__ == "__main__":
    main()

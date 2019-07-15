# Import required modules
import argparse
import face_recognition
import time
import cv2 as cv
import math
from utils.path import list_dirs, list_images
from utils.argument import str2bool
from utils.time import transTime
from utils.face import faceEncoding

############ Add argument parser for command line arguments ############
parser = argparse.ArgumentParser(description="Analysis face data")
parser.add_argument(
    "--dataset",
    type=str,
    default="../server/data/",
    help="path to input directory of faces + images",
)
parser.add_argument(
    "--errors",
    type=str,
    default="./log/error.txt",
    help="path to output error face lists.",
)
parser.add_argument(
    "--log", type=str, default="./log/log.txt", help="path to output log file."
)
parser.add_argument(
    "--detection",
    type=str2bool,
    nargs="?",
    const=True,
    default=False,
    help="Toggle of perform face detection first.",
)
parser.add_argument(
    "--resize",
    type=int,
    nargs="?",
    const=True,
    default=640,
    help="Perform image resizing before learning.",
)
parser.add_argument(
    "--threshold",
    type=float,
    default=0.6,
    help="distance threshold for face recognition.",
)
args = parser.parse_args()


def main():
    # get start time
    start_time = time.time()

    # initialize our lists of extracted facial embeddings and
    # corresponding people names
    print("[INFO] quantifying faces...")
    knownNames = list_dirs(args.dataset)
    print("[INFO] total {} users".format(len(knownNames)))

    # initialize log lists
    log = []

    # initialize error lists
    error = []

    # initial variables
    refFace = []

    for name in knownNames:
        imagePaths = list(list_images(args.dataset + name + "/"))
        info = "[INFO] Check face images of {}".format(name)
        print(info)
        if args.log:
            log.append(info)

        flagRef = True
        for (i, imagePath) in enumerate(imagePaths):
            print("[INFO] processing image {}/{}".format(i + 1, len(imagePaths)))
            if flagRef is True:
                refFace = faceEncoding(args, imagePath)
                if len(refFace) > 0:
                    flagRef = False
                else:
                    print("[ERROR] no face found in image {}".format(imagePath))
                    error.append(imagePath)
            else:
                curFace = faceEncoding(args, imagePath)
                if len(curFace) > 0:
                    face_distances = face_recognition.face_distance(refFace, curFace[0])
                    print(face_distances[0])
                    if args.log:
                        log.append(face_distances[0])
                    """ ADD CONTENT
                    if face_distances[0] > args.threshold:
                    """
                else:
                    print("[ERROR] no face found in image {}".format(imagePath))
                    error.append(imagePath)

    # display and save error list
    if len(error) > 0:
        print("[INFO] total {} error images".format(len(error)))
        with open(args.errors, "w", encoding="utf-8") as f:
            for item in error:
                f.write("%s\n" % item)
            f.close()
            print("[INFO] error lists {} saved".format(args.errors))

    # display and save log
    print("[INFO] total {} face images processed".format(len(log)))
    with open(args.log, "w", encoding="utf-8") as f:
        for item in log:
            f.write("%s\n" % item)
        f.close()
        print("[INFO] log {} saved".format(args.log))

    # calculate processing time
    tick = (time.time() - start_time) * 1000
    transTime(tick, "[INFO] Total process time: ")


if __name__ == "__main__":
    main()

# Import required modules
import argparse
import face_recognition
import time
import cv2 as cv
import math
from utils.argument import str2bool
from utils.time import transTime
from utils.face import faceEncoding

############ Add argument parser for command line arguments ############
parser = argparse.ArgumentParser(
    description="Compute face distance between two images"
)
parser.add_argument(
    "--inp1", type=str, required=True, help="path to the first input image."
)
parser.add_argument(
    "--inp2", type=str, required=True, help="path to the second input image."
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
args = parser.parse_args()

def main():
    # get start time
    start_time = time.time()

    face1 = faceEncoding(args, args.inp1)
    if len(face1) is 0:
        raise Exception("[ERROR] no face found in image {}".format(args.inp1))

    face2 = faceEncoding(args, args.inp2)
    if len(face2) is 0:
        raise Exception("[ERROR] no face found in image {}".format(args.inp2))

    face_distances = face_recognition.face_distance(face2, face1[0])
    for distance in face_distances:
        print("[INFO] face distance is {}".format(distance))

    # calculate processing time
    tick = (time.time() - start_time) * 1000
    transTime(tick, "[INFO] Total process time: ")

if __name__ == "__main__":
    main()

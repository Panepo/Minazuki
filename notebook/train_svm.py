# Import required modules
import pickle
import argparse
import time
from sklearn import svm
from utils.time import transTime

############ Add argument parser for command line arguments ############
parser = argparse.ArgumentParser(
    description="Train SVM classifier from compressed pickle file."
)
parser.add_argument(
    "--pickle", type=str, default="face.pickle", help="path to input pickle of faces"
)
parser.add_argument(
    "--svm",
    type=str,
    default="face_svm.pickle",
    help="path to output pickle of svm model",
)
args = parser.parse_args()


def main():
    # get start time
    start_time = time.time()

    # load learned faces
    print("[INFO] loading faces ...")
    # check the image source comes from
    print("[INFO] faces loaded from {} ...".format(args.pickle))
    data = pickle.loads(open(args.pickle, "rb").read())

    # create and train the SVM classifier
    print("[INFO] training SVM classifier ...")
    clf = svm.SVC(gamma="scale")
    clf.fit(data["embeddings"], data["names"])

    # save trained SVM model
    with open(args.svm, "wb") as f:
        f.write(pickle.dumps(clf))
        f.close()
        print("[INFO] SVM classifier model {} saved".format(args.svm))

    # calculate processing time
    tick = (time.time() - start_time) * 1000
    transTime(tick, "[INFO] Total process time: ")


if __name__ == "__main__":
    main()

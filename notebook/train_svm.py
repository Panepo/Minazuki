# Import required modules
import pickle
import argparse
from sklearn import svm

############ Add argument parser for command line arguments ############
parser = argparse.ArgumentParser(
    description="Train SVM classifier from compressed pickle file."
)
parser.add_argument(
    "--pickle", type=str, default="face.pickle", help="path to input pickle of faces"
)
parser.add_argument(
    "--svm", type=str, default="face_svm.pickle", help="path to output pickle of svm model"
)
args = parser.parse_args()

def main():
    # load learned faces
    print("[INFO] loading faces ...")
    # check the image source comes from
    print("[INFO] faces loaded from {} ...".format(args.pickle))
    data = pickle.loads(open(args.pickle, "rb").read())

    # Create and train the SVC classifier
    print("[INFO] training svm classifier ...")
    clf = svm.SVC(gamma='scale')
    clf.fit(data["embeddings"], data["names"])

    with open(args.svm, 'wb') as f:
      f.write(pickle.dumps(clf))
      f.close()
      print("[INFO] svm classifier model {} saved".format(args.svm))


if __name__ == "__main__":
    main()

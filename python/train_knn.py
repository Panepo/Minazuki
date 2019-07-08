# Import required modules
import pickle
import argparse
import math
import time
from sklearn import neighbors
from utils.time import transTime

############ Add argument parser for command line arguments ############
parser = argparse.ArgumentParser(
    description="Train KNN classifier from compressed pickle file."
)
parser.add_argument(
    "--pickle", type=str, default="face.pickle", help="path to input pickle of faces"
)
parser.add_argument(
    "--knn",
    type=str,
    default="face_knn.pickle",
    help="path to output pickle of knn model",
)
parser.add_argument("--neighbors", default=None, help="KNN parameter: n_neighbors")
parser.add_argument("--algorithm", default="ball_tree", help="KNN algorithm")
args = parser.parse_args()


def main():
    # get start time
    start_time = time.time()

    # load learned faces
    print("[INFO] loading faces ...")
    # check the image source comes from
    print("[INFO] faces loaded from {} ...".format(args.pickle))
    data = pickle.loads(open(args.pickle, "rb").read())

    # Determine how many neighbors to use for weighting in the KNN classifier
    if args.neighbors is None:
        n_neighbors = int(round(math.sqrt(len(data["embeddings"]))))
        print("[INFO] Chose neighbors automatically:", n_neighbors)
    else:
        n_neighbors = args.neighbors

    # Create and train the KNN classifier
    print("[INFO] training KNN classifier ...")
    knn_clf = neighbors.KNeighborsClassifier(
        n_neighbors=n_neighbors, algorithm=args.algorithm, weights="distance"
    )
    knn_clf.fit(data["embeddings"], data["names"])

    # save trained KNN model
    with open(args.knn, "wb") as f:
        f.write(pickle.dumps(knn_clf))
        f.close()
        print("[INFO] KNN classifier model {} saved".format(args.knn))

    # calculate processing time
    tick = (time.time() - start_time) * 1000
    transTime(tick, "[INFO] Total process time: ")


if __name__ == "__main__":
    main()

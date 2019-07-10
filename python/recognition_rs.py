# Import required modules
import cv2 as cv
import argparse
import time
import face_recognition
import pickle
from utils.realsense import realsense, rsOptions
from utils.argument import str2bool
from utils.save import saveResult
from utils.draw import drawResult
from utils.faceMatch import faceMatch

############ Add argument parser for command line arguments ############
parser = argparse.ArgumentParser(
    description="Face recognition demo with OpenCV, dlib and face_recognition libraries."
)
parser.add_argument(
    "--scale", type=float, default=0.5, help="scale factor of input image pre-resize."
)
parser.add_argument(
    "--pickle", type=str, default="./pickle/face.pickle", help="path to input pickle of faces"
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

    # Initialize some variables
    face_locations = []
    process_this_frame = True
    flagCapture = False

    # Create a new named window
    kWinName = "Face recognition demo"

    # Start RealSense Camera
    options = rsOptions()
    options.enableColor = True
    options.resColor = [1280, 720]
    rs = realsense(options)
    rs.deviceInitial()

    try:
        while True:
            # Save program start time
            if args.skip is True:
                if process_this_frame:
                    start_time = time.time()
            else:
                start_time = time.time()

            # Read frame
            rs.getFrame()
            frame = rs.imageColor
            if not frame.any():
                cv.waitKey()
                break

            # Resize frame of video to 1/2 size for faster face recognition processing
            small_frame = cv.resize(frame, (0, 0), fx=args.scale, fy=args.scale)

            # Convert the image from BGR color (which OpenCV uses) to RGB color (which face_recognition uses)
            rgb_small_frame = small_frame[:, :, ::-1]

            if args.skip is True:
                # Only process every other frame of video to save time
                if process_this_frame:
                    face_locations, face_names = faceMatch(rgb_small_frame, data, args.threshold)
                process_this_frame = not process_this_frame
            else:
                face_locations, face_names = faceMatch(rgb_small_frame, data, args.threshold)

            # Display the results
            drawResult(frame, face_locations, face_names, args.scale)

            # Calculate processing time
            if args.skip is True:
                if not process_this_frame:
                    label = "Process time: %.2f ms" % ((time.time() - start_time) * 500)
            else:
                label = "Process time: %.2f ms" % ((time.time() - start_time) * 1000)

            # Display infomation
            if args.info is True:
                if not process_this_frame:
                    print("[INFO] " + label)
                cv.putText(
                    frame, label, (0, 30), cv.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 255)
                )

            # Display the frame
            cv.imshow(kWinName, frame)

            # Process screen capture
            if flagCapture:
                print("[INFO] Screen captured")
                saveResult(frame, 'recognition_rs')
                flagCapture = False

            # Keyboard commands
            getKey = cv.waitKey(1) & 0xFF
            if getKey is ord("c") or getKey is ord("C"):
                flagCapture = True
            elif getKey is ord("q") or getKey is ord("Q"):
                break

    except Exception as e:
        print(e)
        pass

    finally:
        # Stop streaming
        cv.destroyAllWindows()
        rs.pipeline.stop()


if __name__ == "__main__":
    main()

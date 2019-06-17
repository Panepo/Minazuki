# Import required modules
import cv2 as cv
import math
import argparse
import time
import face_recognition

############ Add argument parser for command line arguments ############
parser = argparse.ArgumentParser(
    description="Face detection demo with OpenCV, dlib and face_recognition libraries."
)
parser.add_argument(
    "--input",
    help="Path to input image or video file. Skip this argument to capture frames from a camera.",
)
parser.add_argument("--save", type=bool, help="Toggle of save the generated image.")
parser.add_argument("--skip", type=bool, default=True, help="Toggle of process face detection frame by frame.")
args = parser.parse_args()

def main():
    # Initialize some variables
    face_locations = []
    process_this_frame = True

    # Create a new named window
    kWinName = "Face detection demo"

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
        small_frame = cv.resize(frame, (0, 0), fx=0.25, fy=0.25)

        # Convert the image from BGR color (which OpenCV uses) to RGB color (which face_recognition uses)
        rgb_small_frame = small_frame[:, :, ::-1]

        if args.skip:
            # Only process every other frame of video to save time
            if process_this_frame:
                # Find all the faces and face encodings in the current frame of video
                face_locations = face_recognition.face_locations(rgb_small_frame)
            process_this_frame = not process_this_frame
        else:
            face_locations = face_recognition.face_locations(rgb_small_frame)

        # Display the results
        for (top, right, bottom, left) in face_locations:
            # Scale back up face locations since the frame we detected in was scaled to 1/4 size
            top *= 4
            right *= 4
            bottom *= 4
            left *= 4

            # Draw a box around the face
            cv.rectangle(frame, (left, top), (right, bottom), (0, 255, 0), 2)

        # Calculate processing time
        label = "Process time: %.2f ms" % ((time.time() - start_time) * 1000)
        cv.putText(frame, label, (0, 30), cv.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 255))

        # Display the frame
        cv.imshow(kWinName, frame)

        # Save results
        if args.save:
            fileName = "Output_" + time.strftime("%Y-%m-%d_%H%M%S-", time.localtime()) + '.png'
            cv.imwrite(fileName, frame, [int(cv.IMWRITE_PNG_COMPRESSION), 0])

    # Release handle to the webcam
    cap.release()
    cv.destroyAllWindows()

if __name__ == "__main__":
    main()

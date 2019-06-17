# Import required modules
import cv2 as cv
import numpy as np
import math
import time
import face_recognition
import pyrealsense2 as rs
import argparse

############ Add argument parser for command line arguments ############
parser = argparse.ArgumentParser(
    description="Face detection demo with OpenCV, dlib and face_recognition libraries."
)
parser.add_argument("--skip", type=bool, default=True, help="Toggle of process face detection frame by frame.")
args = parser.parse_args()

def detectDevice():
    deviceDetect = False
    ctx = rs.context()
    devices = ctx.query_devices()

    for dev in devices:
        productName = str(dev.get_info(rs.camera_info.product_id))
        # print(productName)

        # DS 435 config
        if productName in "0B07":
            deviceDetect = True
            print("Connect device: RealSense D435")
            break

        # DS 415 config
        elif productName in "0AD3":
            deviceDetect = True
            print("Connect device: RealSense D415")
            break

    if deviceDetect is not True:
        raise Exception("No supported device was found")


def main():
    # Initialize some variables
    face_locations = []
    process_this_frame = True
    flagCapture = False

    # Create a new named window
    kWinName = "Face detection demo"

    # Start RealSense Camera
    detectDevice()
    pipeline = rs.pipeline()
    config = rs.config()
    config.enable_stream(rs.stream.color, 1280, 720, rs.format.bgr8, 30)
    pipeline.start(config)

    try:
        while True:
            # Save program start time
            start_time = time.time()

            # Read frame
            frames = pipeline.wait_for_frames()
            color_frame = frames.get_color_frame()
            if not color_frame:
                cv.waitKey()
                break

            # Convert frame to numpy array
            frame = np.asanyarray(color_frame.get_data())

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
            cv.putText(
                frame, label, (0, 30), cv.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 255)
            )

            # Display the frame
            cv.imshow(kWinName, frame)

            # Process screen capture
            if flagCapture:
                print("Screen captured")
                fileName = (
                    "Screen_"
                    + time.strftime("%Y-%m-%d_%H%M%S-", time.localtime())
                    + ".png"
                )
                cv.imwrite(fileName, frame, [int(cv.IMWRITE_PNG_COMPRESSION), 0])
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
        pipeline.stop()

if __name__ == "__main__":
    main()

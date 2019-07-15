import cv2 as cv
import math

textFont = cv.FONT_HERSHEY_SIMPLEX
textColor = (255, 255, 255)
textSize = 0.5


def drawResult(image, face_locations, face_names, scale):
    # Display the results
    for (top, right, bottom, left), name in zip(face_locations, face_names):
        # Scale back up face locations since the frame we detected in was scaled
        if scale is not 1:
            scaleV = math.floor(1 / scale)
            top *= scaleV
            right *= scaleV
            bottom *= scaleV
            left *= scaleV

        # Draw a box around the face
        cv.rectangle(image, (left, top), (right, bottom), (0, 255, 0), 2)

        # Draw a label with a name below the face
        cv.rectangle(
            image, (left, bottom - 15), (right, bottom), (255, 0, 0), cv.FILLED
        )
        cv.putText(image, name, (left, bottom), textFont, textSize, textColor, 1)

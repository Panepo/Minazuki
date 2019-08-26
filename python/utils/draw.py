import cv2 as cv
import math

textFont = cv.FONT_HERSHEY_SIMPLEX
textColor = (255, 255, 255)
textSize = 0.5


def drawDetection(image, face_locations, scale):
    # Display the results
    for top, right, bottom, left in face_locations:
        # Scale back up face locations since the frame we detected in was scaled
        if scale is not 1:
            scaleV = math.floor(1 / scale)
            top *= scaleV
            right *= scaleV
            bottom *= scaleV
            left *= scaleV

        # Draw a box around the face
        cv.rectangle(image, (left, top), (right, bottom), (0, 255, 0), 2)


def drawRecognition(image, face_locations, face_names, scale):
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


colorLMLine = (255, 255, 0)
colorLMDot = (255, 0, 255)


def drawLandmarks(image, face_landmarks, scale):
    if scale is not 1:
        scaleV = math.floor(1 / scale)
    else:
        scaleV = 1

    for face_landmark in face_landmarks:
        drawLMCurve(image, face_landmark["chin"], scaleV)
        drawLMCurve(image, face_landmark["left_eyebrow"], scaleV)
        drawLMCurve(image, face_landmark["right_eyebrow"], scaleV)
        drawLMCurve(image, face_landmark["nose_tip"], scaleV)
        drawLMPolygon(image, face_landmark["left_eye"], scaleV)
        drawLMPolygon(image, face_landmark["right_eye"], scaleV)
        drawLMCurve(image, face_landmark["top_lip"], scaleV)
        drawLMCurve(image, face_landmark["bottom_lip"], scaleV)


def drawLMCurve(image, face_landmarks, scaleV):
    for i in range(0, len(face_landmarks) - 1):
        pos1 = tuple([scaleV * x for x in face_landmarks[i]])
        pos2 = tuple([scaleV * x for x in face_landmarks[i + 1]])
        cv.line(image, pos1, pos2, colorLMLine, 1)

    for face_landmark in face_landmarks:
        pos = tuple([scaleV * x for x in face_landmark])
        cv.circle(image, pos, 3, colorLMDot, -1)


def drawLMPolygon(image, face_landmarks, scaleV):
    for i in range(0, len(face_landmarks) - 1):
        pos1 = tuple([scaleV * x for x in face_landmarks[i]])
        pos2 = tuple([scaleV * x for x in face_landmarks[i + 1]])
        cv.line(image, pos1, pos2, colorLMLine, 1)

    pos1 = tuple([scaleV * x for x in face_landmarks[0]])
    pos2 = tuple([scaleV * x for x in face_landmarks[-1]])
    cv.line(image, pos1, pos2, colorLMLine, 1)

    for face_landmark in face_landmarks:
        pos = tuple([scaleV * x for x in face_landmark])
        cv.circle(image, pos, 3, colorLMDot, -1)

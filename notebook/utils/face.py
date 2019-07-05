import face_recognition
import cv2 as cv
import math

def faceEncoding(args, imagePath):
    if args.resize:
        img = cv.imread(imagePath)

        # get image width and height
        height, width = img.shape[:2]
        modHeight = math.floor(args.resize * height / width)

        # resize image
        bgr_image = cv.resize(img, (args.resize, modHeight), interpolation=cv.INTER_CUBIC)

        # Convert the image from BGR color (which OpenCV uses) to RGB color (which face_recognition uses)
        image = bgr_image[:, :, ::-1]
    else:
        image = face_recognition.load_image_file(imagePath)

    if args.detection is True:
        face_locations = face_recognition.face_locations(image)
        face_encodings = face_recognition.face_encodings(image, face_locations)
    else:
        face_encodings = face_recognition.face_encodings(image)

    return face_encodings

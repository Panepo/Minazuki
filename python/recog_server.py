# Import required modules
import time
import face_recognition
import pickle
from utils.faceMatch import faceMatch
from flask import Flask, jsonify, request, redirect

# You can change this to any folder on your system
ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg", "gif"}
PICKLE_PATH = "./pickle/face.pickle"

app = Flask(__name__)

# load learned faces
print("[INFO] loading faces ...")
# check the image source comes from
print("[INFO] faces loaded from {} ...".format(PICKLE_PATH))
data = pickle.loads(open(PICKLE_PATH, "rb").read())


def allowed_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS


@app.route("/", methods=["GET", "POST"])
def upload_image():
    # Check if a valid image file was uploaded
    if request.method == "POST":
        if "file" not in request.files:
            return redirect(request.url)

        file = request.files["file"]

        if file.filename == "":
            return redirect(request.url)

        if file and allowed_file(file.filename):
            # The image file seems valid! Detect faces and return the result.
            return detect_faces_in_image(file)

    # If no valid image file was uploaded, show the file upload form:
    return """
    <!doctype html>
    <title>Face recognition demo</title>
    <h1>Upload a picture</h1>
    <form method="POST" enctype="multipart/form-data">
      <input type="file" name="file">
      <input type="submit" value="Upload">
    </form>
    """


def detect_faces_in_image(file_stream):
    # Load the uploaded image file
    img = face_recognition.load_image_file(file_stream)
    # Get face encodings for any faces in the uploaded image
    _, face_names = faceMatch(img, data, 0.4)

    face_found = False

    if len(face_names) > 0:
        face_found = True

    # Return the result as json
    result = {"face_found_in_image": face_found, "face_found": face_names}
    return jsonify(result)


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001, debug=True)

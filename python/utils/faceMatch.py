import face_recognition
import numpy as np

def faceMatch(image, data, threshold):
    # Find all the faces and face encodings in the current frame of video
    face_locations = face_recognition.face_locations(image)
    face_encodings = face_recognition.face_encodings(
        image, face_locations
    )

    face_names = []
    for face_encoding in face_encodings:
        # See if the face is a match for the known face(s)
        matches = face_recognition.compare_faces(
            data["embeddings"], face_encoding, tolerance=threshold
        )
        name = "Unknown"

        # # If a match was found in known_face_encodings, just use the first one.
        # if True in matches:
        #     first_match_index = matches.index(True)
        #     name = known_face_names[first_match_index]

        # Or instead, use the known face with the smallest distance to the new face
        face_distances = face_recognition.face_distance(
            data["embeddings"], face_encoding
        )
        best_match_index = np.argmin(face_distances)
        if matches[best_match_index]:
            name = data["names"][best_match_index]

        face_names.append(name)

    return face_locations, face_names

def faceMatchKNN(image, knn, data, threshold):
    # Find all the faces and face encodings in the current frame of video
    face_locations = face_recognition.face_locations(image)
    face_encodings = face_recognition.face_encodings(
        image, face_locations
    )

    closest_distances = knn.kneighbors(face_encodings, n_neighbors=1)
    face_names = []
    for i in range(len(face_locations)):
        if closest_distances[0][i][0] <= threshold:
            best_match_index = closest_distances[1][i][0]
            name = data["names"][best_match_index]
        else:
            name = "Unknown"
        face_names.append(name)

    return face_locations, face_names

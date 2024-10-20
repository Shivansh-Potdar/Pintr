var firebaseConfig = {
    apiKey: "AIzaSyCG6Ib8bT8Wd1m8Y96Sazgf9dNUFbDRGgc",
    authDomain: "pintr-72e5d.firebaseapp.com",
    projectId: "pintr-72e5d",
    storageBucket: "pintr-72e5d.appspot.com",
    messagingSenderId: "656300257202",
    appId: "1:656300257202:web:f29725c3923942b3e67eab",
    measurementId: "G-9QTCX76VEF"
};

firebase.initializeApp(firebaseConfig);

firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        var email = user.email;
        console.log("User's email: ", email);
        getUserPhotos(email);
        $('#signOutBtn').show();
    } else {
        console.log("not allowed here");
        $('#signOutBtn').hide();
        window.location.replace('index.html');
    }
});

var storage = firebase.storage();

function getUserPhotos(email) {
    var storageRef = storage.ref(email + '/'); 
    storageRef.listAll().then(function(result) {
        result.items.forEach(function(itemRef) {
            itemRef.getDownloadURL().then(function(url) {
                console.log("Download URL:", url);
                displayPhoto(url);
            }).catch(function(error) {
                console.error("Error getting download URL:", error);
            });
        });
    }).catch(function(error) {
        console.error("Error listing files:", error);
    });
}

function handleFileUpload(event, email) {
    var files = event.target.files;
    for (var i = 0; i < files.length; i++) {
        var file = files[i];
        var storageRef = storage.ref(email + '/' + file.name); // Save file in user's folder
        var uploadTask = storageRef.put(file);

        uploadTask.on('state_changed', 
            function(snapshot) {
                var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log('Upload is ' + progress + '% done');
            }, 
            function(error) {
                console.error('Upload failed:', error);
            }, 
            function() {
                uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
                    console.log('File available at', downloadURL);
                    displayPhoto(downloadURL);
                });
            }
        );
    }
}

function displayPhoto(url) {
    var div = $('<div>').addClass('card');
    var img = $('<img>').attr('src', url); 

    div.append(img);
    $('#photos').append(div);
}

function SignOut(){
    firebase.auth().signOut().then(function() {
        console.log('User signed out.');
        window.location.replace('index.html');
    }).catch(function(error) {
        console.error('Sign out error:', error);
    });
}

// Liking Code and Modal Code
$(document).ready(function() {
    let currentLikes = 0;
    $(document).on('click', '.card img', function() {
        var src = $(this).attr('src'); 
        $('#modalImage').attr('src', src); 
        $('#photoModal').show(); 

        let photoId = $(this).attr('data-photo-id');
        fetchLikes(photoId);
    });

    $('.close').on('click', function() {
        $('#photoModal').hide();
    });

    $('#likeBtn').on('click', function() {
        currentLikes++;
        $('#likeCount').text(currentLikes);

        var photoId = $('#modalImage').attr('data-photo-id');
        saveLikes(photoId, currentLikes);
    });

    function fetchLikes(photoId) {
        currentLikes = 0;
        $('#likeCount').text(currentLikes);
    }

    function saveLikes(photoId, likes) {
        console.log('Saving likes for photo ID:', photoId, 'with likes:', likes);
    }
});
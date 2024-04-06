// Constants and Variables
const MUSIC_URL = 'music_metadata.json';
const songList = document.querySelector('.songList');
const audioPlayer = document.querySelector(".audio-player");
const audioControls = document.querySelector(".audio-player-controls");
const seekbar = audioControls.querySelector(".song-seekbar");
const seekbarPointer = audioControls.querySelector(".seekbar-pointer");
const musicPlayer = document.querySelector(".song-player-controls");
const playPauseBtn = musicPlayer.querySelector("#playPause");
const nextBtn = musicPlayer.querySelector("#next");
const prevBtn = musicPlayer.querySelector("#prev");
const songInfo = musicPlayer.querySelector(".song-info");
const songImg = musicPlayer.querySelector(".song-img");
const songTitle = musicPlayer.querySelector(".song-title");
const songArtist = musicPlayer.querySelector(".song-artist");
const songTimer = musicPlayer.querySelector(".song-timer");
const repeatBtn = musicPlayer.querySelector("#repeat");
const shuffleBtn = musicPlayer.querySelector("#shuffle");
const toggleBtn = document.querySelector("#toggleBtn");
const leftSide = document.querySelector(".left-side");
const searchBox = document.querySelector(".searchbox");
const searchBtn = document.querySelector(".search-icon");
const searchInput = document.querySelector(".search-input");
const suggestionsContainer = document.querySelector(".suggestions-container");
const songImage = audioPlayer.querySelector(".song-image");
const scaleBtn = document.querySelector(".scale-down");
const showPlaylist = document.querySelector(".show-playlist");
const upNextSongs = document.querySelector(".upNext-songs");
const upNextSongList = document.querySelector('.upNextSongList');

// Audio
const mainAudio = new Audio();
let songs = [];
let currentSongIndex = 0;

// Event Listener to show the playlist
showPlaylist.addEventListener("click", () => {
    upNextSongs.classList.toggle("display");
});

//Song Info  
songInfo.addEventListener("click", () => {
    audioPlayer.classList.add("scale");
    musicPlayer.classList.add("scale");
    songTimer.classList.add("scale");
    audioPlayer.querySelector(".audio-info").classList.add("scale");
    audioControls.classList.add("scale");
    if (window.innerWidth <= 500) {
        if (musicPlayer.classList.contains("scale")) {
            if (songImg.style.display === "block") {
                songImg.style.display = "none";
                playPauseBtn.querySelector("img").style.width = "60px";
            }
        }
    }
});

// Display the UpNextSongs playlist
scaleBtn.addEventListener("click", () => {
    audioPlayer.classList.remove("scale");
    musicPlayer.classList.remove("scale");
    songTimer.classList.remove("scale");
    audioPlayer.querySelector(".audio-info").classList.remove("scale");
    audioControls.classList.remove("scale");
    if (!musicPlayer.classList.contains("scale")) {
        if (songImg.style.display === "none") {
            songImg.style.display = "block";
            playPauseBtn.querySelector("img").style.width = "40px";
        }
    }
});


// Event Listener for the toggle the sidebar
toggleBtn.addEventListener("click", () => {
    console.log("toggle clik")
    leftSide.classList.toggle("active");
    if (leftSide.classList.contains("active")) {
        toggleBtn.querySelector('img').src = "Icons/close.svg";
    }
    else {
        toggleBtn.querySelector("img").src = "Icons/menu.svg"
    }
});

// Event listener to the search btn
searchBtn.addEventListener("click", () => {
    if (searchInput.style.display === 'block') {
        searchBox.classList.remove("center");
        searchBtn.src = "Icons/Search.svg";
        searchInput.style.display = 'none';
        suggestionsContainer.style.display = 'none';
    } else {
        searchBox.classList.add("center");
        searchBtn.src = "Icons/arrow.svg";
        searchInput.style.display = 'block';
        searchInput.focus();
    }
});

// Function to toggle the search input
function toggleSearchInput() {
    if (window.innerWidth <= 768) {
        searchBtn.src = "Icons/Search.svg"; // Change search icon to default
        suggestionsContainer.style.display = 'none';
    } else {
        searchInput.classList.remove("center");
        searchBtn.src = "Icons/Search.svg"; // Change search icon for larger screens
        searchInput.focus(); // Focus on the input field
    }
}

// Initial call to toggle on search input
toggleSearchInput();

// Event listener to toggle on search input on window resize
window.addEventListener('resize', toggleSearchInput);

// Function to display suggestions
function showSuggestions() {
    const inputValue = searchInput.value.toLowerCase();//take the input value

    const matchedSuggestions = songs.filter(suggestion =>
        suggestion.title.toLowerCase().includes(inputValue)//match the input to data in the array
    );
    // Clear previous suggestions
    suggestionsContainer.innerHTML = '';

    // Display matched suggestions
    matchedSuggestions.forEach((suggestion) => {
        const index = songs.indexOf(suggestion); // Find the index of the matched suggestion

        // create the suggestion element to display the suggestion.
        const suggestionElement = document.createElement('div');
        suggestionElement.classList.add('suggestion-item');//set the class suggestion-item
        suggestionElement.setAttribute("id", index);//set the id attribute

        // content of the suggestion element
        suggestionElement.innerHTML = `<div class="song-item-info">
                                            <h5 class="song-item-title">${suggestion.title}</h5>
                                            <h6 class="song-item-author">${suggestion.author}</h6>
                                        </div>`;

        // Event listener for suggestion click
        suggestionElement.addEventListener('click', () => {
            const clickedIndex = parseInt(suggestionElement.getAttribute("id")); // Get the clicked suggestion's index

            searchInput.value = '';//set the value of searchinput to none
            searchBtn.src = "Icons/Search.svg";//change the icon
            searchBox.classList.remove("center");//remove the center class
            suggestionsContainer.style.display = 'none';

            currentSongIndex = clickedIndex;//Update the currentSongIndex
            songImg.style.display = "block";//set the display block to songImg

            if (window.innerWidth > 768) {
                searchInput.style.display = 'block';//set the display of searchinput to block
            }
            else {
                searchInput.style.display = 'none';//set the display of searchinput to none
            }

            playSong(clickedIndex); // Play the clicked song
            updatePlayingClass(clickedIndex);//call the updatedPlayingClass function
            suggestionsContainer.innerHTML = ''; // Clear suggestions container
        });

        suggestionsContainer.appendChild(suggestionElement);
    });

    // Show/hide suggestions container based on input value
    if (inputValue.length > 0 && matchedSuggestions.length > 0) {
        suggestionsContainer.style.display = 'block';
    } else {
        suggestionsContainer.style.display = 'none';
    }
}

// Event listener for input changes
searchInput.addEventListener('input', showSuggestions);


// Functions

// Fetches songs metadata from the provided URL
async function getSongs() {
    try {
        const response = await fetch(MUSIC_URL);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching music data:', error);
    }
}

// Displays the list of songs on the webpage
function displaySongList(songs) {
    // Sort songs alphabetically by title
    songs.sort((a, b) => a.title.localeCompare(b.title));

    songs.forEach((song, index) => {
        const listItem = createSongListItem(song, index);
        songList.appendChild(listItem);
    });
}

// Display the up next list of songs on the webpage
function displayUpNextList(songs) {
    // Inside displayUpNextList function
    songs.forEach((song, index) => {
        const listItem = createSongListItem(song, index);
        listItem.classList.add('upNextSong-item');
        upNextSongs.appendChild(listItem);
    });
}

// Creates a list item for a song
function createSongListItem(song, index) {
    const listItem = document.createElement('li');

    listItem.classList.add("song-item");//add the class the song-item
    listItem.setAttribute('id', `${index}`);//add the id attribute

    // Insert the content
    listItem.innerHTML = `
        <div class="song-item-img">
            <img src="${song.img}" alt="Song-Img">
        </div>
        <div class="song-item-info">
            <h5 class="song-item-title">${song.title}</h5>
            <h6 class="song-item-author">${song.author}</h6>
        </div>`;

    // Add click event listener to play the song and apply 'playing' class
    listItem.addEventListener("click", () => {
        songImg.style.display = "block";//set the display block to songImg
        currentSongIndex = index;//Update the currentSongIndex

        playSong(index);//play the clicked song
        updatePlayingClass(index); // Call the updated function
    });
    return listItem;
}


// Converts seconds to formatted minutes and seconds
function formatTime(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');
    return `${formattedMinutes}:${formattedSeconds}`;
}

// Load and play the selected song
function playSong(index) {
    const selectedSong = songs[index];
    songImg.src = selectedSong.img;//load the song img
    songImage.src = selectedSong.img;
    songTitle.innerText = selectedSong.title;//load the song title
    songArtist.innerText = selectedSong.author;//load the song artist
    mainAudio.src = selectedSong.src;//load the song src

    // Ensure audio is fully loaded before attempting to play
    mainAudio.onloadeddata = () => {
        mainAudio.play().catch(error => {
            console.error('Error playing audio:', error);
        });
    };
    playPauseBtn.querySelector("img").src = "Icons/pause.svg"
}

// Initializes the music player
async function initializePlayer() {
    songs = await getSongs();
    displaySongList(songs);
    displayUpNextList(songs);
}

// Event Listeners fo music

// Play/Pause button click event
playPauseBtn.addEventListener("click", () => {
    if (mainAudio.paused) {
        mainAudio.play();//play the song
        playPauseBtn.querySelector("img").src = "Icons/pause.svg"
    } else {
        mainAudio.pause();//pause the song
        playPauseBtn.querySelector("img").src = "Icons/play.svg"
    }
});

// Event listener for next button
nextBtn.addEventListener("click", () => {
    currentSongIndex++; //increment of CurrentSongIndex by 1
    //if CurrentSongIndex is greater than array length then CurrentSongIndex will be 0 so the first music play
    currentSongIndex > songs.length - 1 ? currentSongIndex = 0 : currentSongIndex = currentSongIndex;
    playSong(currentSongIndex);
    updatePlayingClass(currentSongIndex);
});

// Event listener for previous button
prevBtn.addEventListener("click", () => {
    currentSongIndex--; //decrement of CurrentSongIndex by 1
    //if CurrentSongIndex is less than 0 then CurrentSongIndex will be the array length so the last music play
    currentSongIndex < 0 ? currentSongIndex = songs.length - 1 : currentSongIndex = currentSongIndex;
    playSong(currentSongIndex);
    updatePlayingClass(currentSongIndex);
});

// Update the 'playing' class on the next or previous music in both songList and upNextSongs
function updatePlayingClass(index) {
    //get the song-item form both the song-List and upNextSong
    const allSongItems = document.querySelectorAll('.song-item');
    const allUpNextSongItems = upNextSongs.querySelectorAll('.song-item');

    // Remove 'playing' class from all song items in both lists
    allSongItems.forEach(item => item.classList.remove('playing'));
    allUpNextSongItems.forEach(item => item.classList.remove('playing'));

    // Add 'playing' class to the corresponding song item in both lists
    const songItems = document.querySelectorAll(`.song-item[id = '${index}']`);
    songItems.forEach(item => item.classList.add('playing'));
}


// Update song timer as the song progresses
mainAudio.addEventListener("timeupdate", () => {
    // get the currentTime and duration of the playing song
    const currentTime = mainAudio.currentTime;
    const duration = mainAudio.duration;
    // update the seekbar-pointer width with the updated currentTime
    seekbarPointer.style.width = (currentTime / duration) * 100 + "%";
    // update the song time vlaue with the updated song currentTime and duration
    songTimer.querySelector(".current-time").textContent = `${formatTime(currentTime)}`;
    songTimer.querySelector(".max-duration").textContent = `${formatTime(duration)}`;
});

// Seekbar click event
seekbar.addEventListener("click", (e) => {
    // get the width of the seekbar
    const seekbarWidth = seekbar.clientWidth;
    const clickedOffsetX = e.offsetX;//get the point where the pointer is clicked on the seekbar
    const songDuration = mainAudio.duration;//get the song duration

    // update the song time vlaue with the updated song currentTime and duration
    mainAudio.currentTime = (clickedOffsetX / seekbarWidth) * songDuration;
    // update the seekbar-pointer width with the updated currentTime 
    seekbarPointer.style.width = (clickedOffsetX / seekbarWidth) * songDuration;
});

// change the track to loop,repeat one
repeatBtn.addEventListener("click", () => {
    let repeatMode = repeatBtn.getAttribute("data");//get the repeat value
    // checks the repeat mode value
    if (repeatMode === "repeat") {
        repeatBtn.setAttribute("data", "repeat_one")//update the  id attribute vlaue
        repeatBtn.querySelector('img').src = "Icons/repeat-1.svg";
        console.log("repeat one activated");
    }
    else {
        repeatBtn.setAttribute("data", "repeat")//update the id attribute value
        repeatBtn.querySelector('img').src = "Icons/repeat.svg"
        console.log("repeat all activated");
    }
});


// Function to toggle shuffle mode
function toggleShuffleMode() {
    let isShuffleOn = shuffleBtn.getAttribute("data");//get the shuffle value
    // checks the shuffle value
    if (isShuffleOn === "shuffleNot") {
        shuffleBtn.setAttribute("data", "shuffle");//update the id attribute value
        shuffleBtn.querySelector("img").src = "Icons/shuffle on.svg"
        console.log("Shuffle Mode activated.");
    } else {
        shuffleBtn.setAttribute("data", "shuffleNot");//update the is attribut value
        shuffleBtn.querySelector("img").src = "Icons/shuffle.svg"
        console.log("Shuffle Mode deactivated.");
    }
}

// Shuffle button click event
shuffleBtn.addEventListener("click", toggleShuffleMode);


// Update the class playing to next music based on repeat and shuffle mode
mainAudio.addEventListener("ended", () => {
    let getRepeatMode = repeatBtn.getAttribute("data");//get the repeat mode value
    let isShuffleOn = shuffleBtn.getAttribute("data");//get the shuffle mode value

    if (getRepeatMode === "repeat_one") {
        mainAudio.currentTime = 0;
        mainAudio.play();
        console.log("Repeating current song.");
    } else if (isShuffleOn === "shuffle" && getRepeatMode === "repeat") {
        // If shuffle is on and repeat all is on, shuffle and play next song
        let shuffledIndex;
        do {
            shuffledIndex = Math.floor((Math.random() * songs.length));
        } while (currentSongIndex == shuffledIndex); //this loop run until the next random number won't be the same of current musicIndex
        currentSongIndex = shuffledIndex; //passing randomIndex to musicIndex
        playSong(currentSongIndex);
        updatePlayingClass(currentSongIndex);
    } else {
        nextBtn.click();
    }
});

// Main execution
initializePlayer();

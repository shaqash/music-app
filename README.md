This Android app offers background playing from Youtube with a music app User Experience.

It was built on React Native using [NewPipeExtractor](https://github.com/TeamNewPipe/NewPipeExtractor), developed using Cursor with minimal manual intervention.

# Key notes

- Bootstrap working project using AI as fast as possible
- Progress dev log.
- Modern, music app focused UI/UX.
- Use NewPipeExtractor for fetching data from Youtube for background playing.

# Takeaway summary

I wouldn't have built this app if not for AI, too lazy. The Java parts would have taken much longer since I'm not an expert.
Read individual takeaways below.

# Features

- [x] Music streaming and controls
- [X] Play in background
- [x] Search
- [x] Autoplay next track
- [x] Display recent videos
- [x] Show track info
- [x] Display related tracks as "next up"
- [ ] queue
- [ ] playlist
- [ ] add data source for podcasts

# Dev log

## Day 1

Started building app using Cursor Pro free trial. All code gen was done using claude-3.5-sonnet

**Attempt 1**: Gave app description - Cursor started generating code for the components/java code for extractor integration, then after the fact use react native init command, which was problematic at this point. The project was not structured correctly and did not build.

**Attempt 2**: Manually init a react native project, then proceeded to give instructions, this time, feature by feature, starting with the java integration with NewPipeExtractor for StreamInfo -> Search, then UI features like audio controls. At first instructed to create a basic UI just to test the functionality and in the end asked to refactor UI to look more modern. It proved to be a better approach.

### Takeaways
* Before code gen, init a project so the structure would be correct.
* Code gen feature by feature over all at once.
* AI was helpful in fixing not only code but also JDK configuration, fixed setup to use jdk 17 which is more stable for React Native, which helped solving build issues.
* You can build a working PoC pretty fast :)
* The Java parts were hard with a lot of hallucinations and trial and error. Tried giving link to docs and eventually link to code on github which was crucial for solving Search.
* The React code was very messy and didn't share state/seperate to hooks on it's own. Had to give instructions.

### Achieved
* Search
* Track info page
* Working audio controls
* Auto play
* "Home page" with recent tracks.
* Implement display "next up" in track info page.

*todo add tag/release here*

## Day 2

> This was only half a day, due to free trial ending. Did not decide yet rather to pay or not.

Started by setting rules in cursor so the code would end up cleaner. Not sure if it listened to the rules or not.

Started by migrating from react-native-sound to react-native-track-player for easier audio controls and play in notification. Then did some cleanup, removing unused dependencies, moving logic to hooks and state to Context.
After that, asked to implmenet auto play next track using "next up" feature, developed in day 1.
To finish the day and unfortunatly Cursor free trial, asked for UI improvements, gave screenshots and description of the desired UI, but it was not really helpful, either refactored only parts of the UI, giving it an inconsistant look or wasn't really like described. Anyway I stopped trying when the trial ended.

### Takeaways
* react-native-track-player is much easier to use for music apps and gives more out of the box features.
* Need better Cursor rules.

### Achieved
* Audio controls in notifications
* Auto play next track
* Solved some UI overlap

### Screenshot
![image](https://github.com/user-attachments/assets/aa456ead-6b08-4120-bbb2-c3c2492c4d2d)

*todo add tag/release here*

# Getting Started Developing

## Step 1: Start Metro

First, you will need to run **Metro**, the JavaScript build tool for React Native.

To start the Metro dev server, run the following command from the root of your React Native project:

```sh
# Using npm
npm start
```

## Step 2: Build and run your app

With Metro running, open a new terminal window/pane from the root of your React Native project, and use one of the following commands to build and run your Android or iOS app:

### Android

```sh
# Using npm
npm run android
```

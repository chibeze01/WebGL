# WebGL User Guide
Read the full report [here](./CM20219_WebGl_report(1).pdf)
## Setting up the Web Server

To create the web server, follow these steps:

1. **Install Python**: Download Python 3.7 from the [official Microsoft store link](https://www.microsoft.com/en-gb/p/python-37/9nj46sx7x90p).

2. **Access Terminal or Command Line**: Open a command line or terminal in the directory where you have stored your coursework. If you're on Windows, you can do this by pressing shift + right click within the directory, and then select “Open command window here”.

3. **Start a Web Server with Python**: Initiate a simple web server using Python by typing: “python -m http.server PORT” in your terminal or command line. Replace PORT with the number of your choice. This number indicates the port at which the server will listen (e.g., 32007).

4. **Access the Server via Browser**: Open your web browser and navigate to “http://localhost:PORT”, where “PORT” is the number you used in Step 3.

## Keybindings

Here is a summary of the keybindings for various actions:

**Rotation Controls:**

- Y-axis rotation: `y`
- X-axis rotation: `x`
- Z-axis rotation: `z`

**Panning Controls:**

- Pan up: `up arrow key`
- Pan down: `down arrow key`
- Pan right: `right arrow key`
- Pan left: `left arrow key`

**Dolly Controls:**

- Dolly forwards: `+`
- Dolly backwards: `-`

**Other Controls:**

- Reset: `r`
- Face mode: `f`
- Edge mode: `e`
- Vertices mode: `v`
- Bunny face mode: `i`
- Bunny edge mode: `o`
- Bunny vertices mode: `p`
- Orbit the mouse (arc ball mode): `any mouse push button`
- Remove grid: `g`
- Camera & light orbit animation: `q`
- Cool feature & rotation stop/start: `space-bar`
- Camera in head position in cool feature: `h`
- Camera in Minecraft box in cool feature: `m`

## Tips and Tricks

When using the 'cool feature' that involves a lot of objects, you may experience some loading lag during debugging. Occasionally, you may encounter an error during loading – simply refresh the webpage to resolve this.

In the 'cool feature' scene, press `h` to position the camera behind the head for an illusion that the head is still looking at you. The shadows from this position also create a visually stunning effect.

## System Requirements

This WebGL application is compatible with most modern systems and performs optimally on Opera, Edge, and Chrome browsers. Here are the specs of a system where the application was successfully run:

- Processor: AMD A10-8700P Radeon R6, 10 Compute Cores 4C+6G, 1800 Mhz, 2 Core(s), 4 Logical Processor(s)
- OS: Microsoft Windows 10 Home
- Physical Memory: 7.47 GB

# Audio

## Hardware
Soundcard does digital (PCI) to analog (cinch) conversion.
PCM is the most common digital audio format.

```bash
aplay -l
**** List of PLAYBACK Hardware Devices ****
card 0: HDMI [HDA Intel HDMI], device 3: HDMI 0 [HDMI 0]
  Subdevices: 1/1
  Subdevice #0: subdevice #0
card 1: PCH [HDA Intel PCH], device 0: CX20751/2 Analog [CX20751/2 Analog]
  Subdevices: 1/1
  Subdevice #0: subdevice #0
```
- PCH is the soundcard that is connected to the moss-green standard plug.
- HDMI is for both audio and video. Use this card only if your sound-system is actually connected via the trapezoidal HDMI plug.

## Kernel soundcard-driver
To allow os to read and write to/from soundcard.

- Old: OSS (Open Sound System)
- New: ALSA (Advanced Linux Sound Architecture)

Many apps can support using ALSA directly.
But this does not support multiplexing: if an app uses ALSA directly, no other app can use the soundcard.

## Sound-servers: Pulseaudio, Pipewire, Jackd

Program (client) -> Pulseaudio (server) -> ALSA (driver) -> soundcard

Also goes backwards: one mic can be used in multiple apps at the same time.

Sound-servers can resample (= adjust sampling rate) and mix multiple audio-streams before sending them to the sound-card.

- Pulseaudio: old
- Jackd: more flexible than pulseaudio.
    - Pulseaudio does mostly 1-input to 1-output connections.
    - Jackd can do many-to-one connections and chaining.
    - Jackd also has less latency.
    - Also supports MIDI (pulseaudio does not)
- Pipeware: should one day replace both pulseaudio and jackd.

Pulseaudio and jack aren't very compatible. 
Commonly you add pulseaudio as an input to jack if you want to use both. Not good in terms of latency.

## Common error messages
- `Unable to start JACK server: unable to allocate memory` 
    -> user must be added to `audio` group: `sudo usermod -a -G audio michael`
- `ALSA: Cannot open PCM device alsa_pcm for playback` -> alsa_pcm is probably hogged by pulseaudio. 
    - Deactivate pulseaudio for the duration of your jackd session using:
    - `pasuspender -- qjackclt`
- `Cannot open socket`:
    - JACK must access the correct soundcard.
    - In settings, deactivate real-time mode and chose your `PCH` card as the interface (not the HDMI card)

## Protocols
### Open Sound Control
Encodes notes like MIDI does. But can be transferred over TCP.
Both overtone and sonic-pi have OSC-servers.


## Supercollider

Supercollider is a simple audio-synthesizer that talks (most commonly) to jackd.
It has an own language, but languages talk to the supercollider-daemon in a client-server-architecture, so that other languages may use the supercollider-engine, too. Two of the most popular ones are Sonic-PI (ruby) and Overtone (clojure).

## Overtone
In the words of Sam Aaron - core-contributor to overtone and creator of sonic-pi - overtone is more low-level than sonic-pi.
Overtone allows to create new synths on the fly, which sonic-pi doesn't.
Sonic-pi has more built in abstractions already there ... which you may like or not.
It's a little like comparing Webgl to threejs.

## Sonic-PI

### Packages
Fortunately, there are pre-built packages for linux, too. [This one](https://sonic-pi.net/files/releases/v3.3.1/sonic-pi_3.3.1_2_armhf.deb) worked for me on mint, even though it is intended for ubuntu 20. Remarkably, it even automatically works without me starting jackd.

### Building
Quite tricky.
As per [github](https://github.com/sonic-pi-net/sonic-pi/blob/dev/BUILD-LINUX.md).
- Requires cmake
- Requires OpenGL
- Requires QT: `sudo apt-get install qt5-default libqt5scintilla2-dev libqwt-qt5-dev libqt5svg5-dev qt5-qmake qt5-default qttools5-dev qttools5-dev-tools qtdeclarative5-dev libqt5webkit5-dev qtpositioning5-dev libqt5sensors5-dev qtmultimedia5-dev libffi-dev`
- Requires latest erlang and elixir - nicely described [here](https://r00t4bl3.com/post/how-to-install-elixir-on-linux-mint-20-ubuntu-20-04-focal-fossa). If you're on Mint, don't forget to edit `/etc/apt/sources.list.d/erlang-solutions.list` replacing `ulyana` with `focal`.

### GUI
Keyboard-bindings seem to be [emacs-like](https://github.com/sonic-pi-net/sonic-pi/blob/dev/etc/doc/tutorial/B.02-Shortcut-Cheatsheet.md)

## Theory

Based on analog synthesizer.

Inputs: 
 - Microphone
 - Oscillator
    - frequency, amplitude, waveform
 - Samples

Nodes:
 - Gain: adjusts volume
 - Filter: changes sound
 - Analyzer: visualizes

Output:
 - Speakers

```ts

//------ 1. Creating context ----------------------------------------
const humanHearingMaxRate = 20000; // Hz
const sampleRate = 2 * humanHearingMaxRate; // because signal reconstruction

const ctx = new AudioContext({
    sampleRate
});

const gainNode = ctx.createGain();  // global volume control
const gainValue = 0.05;
const validFrom = 0;
gainNode.gain.setValueAtTime(gainValue, validFrom);
gainNode.connect(ctx.destination);

//------- 2. Creating some audio data ------------------------------------
const bufferSeconds = 0.5;
const bufferChannels = 1;  // 1: mono, 2:stereo, 5:5ptSurround

const buffer = ctx.createBuffer(bufferChannels, bufferSeconds * sampleRate, sampleRate);
const bufferData = buffer.getChannelData(0);

for (let i = 0; i < bufferData.length; i++) {
    bufferData[i] = Math.random() * 2 - 1;
}

//--------- 4. filter --------------------------------
const snareFilter = ctx.createBiquadFilter();
snareFilter.type = 'notch';
snareFilter.frequency.value = 1500;
snareFilter.connect(gainNode);


document.getElementById('wn')!.addEventListener('click', () => {
    //--------- 3. wrapping audio data in node ------------
    // A buffer source is one-time-usage only. Need to create a new one every time.
    const whiteNoiseSource = ctx.createBufferSource();
    whiteNoiseSource.buffer = buffer;
    whiteNoiseSource.connect(gainNode);
    whiteNoiseSource.start();
});

document.getElementById('sn')!.addEventListener('click', () => {
    const whiteNoiseSource = ctx.createBufferSource();
    whiteNoiseSource.buffer = buffer;
    whiteNoiseSource.connect(snareFilter);
    whiteNoiseSource.start();
});

document.getElementById('kd')!.addEventListener('click', () => {
    const kickOscillator = ctx.createOscillator();
    kickOscillator.type = 'sawtooth';
    kickOscillator.frequency.setValueAtTime(461.6, 0);
    kickOscillator.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.5);

    // a dedicated gain node with decreasing volume prevents
    // the speaker-click-sound at the end of a sample
    const kickGainNode = ctx.createGain();
    kickGainNode.gain.setValueAtTime(1, 0);
    kickGainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
    
    kickGainNode.connect(gainNode);
    kickOscillator.connect(kickGainNode);
    kickOscillator.start();
    kickOscillator.stop(ctx.currentTime + 0.5);
});


//------------ 5. Samplers ----------------
const url = 'https://unpkg.com/@teropa/drumkit@1.1.0/src/assets/hatOpen.mp3';
let highHatBuffer;
fetch(url).then(data => {
    data.arrayBuffer().then(rawData => {
        ctx.decodeAudioData(rawData).then(decoded => {
            highHatBuffer = decoded;
            console.log('data downloaded');
        });
    });
});

document.getElementById('hh')!.addEventListener('click', () => {
    const highHatSource = ctx.createBufferSource();
    highHatSource.buffer = highHatBuffer;
    highHatSource.playbackRate.setValueAtTime(0.5, 0);

    highHatSource.connect(gainNode);
    highHatSource.start();
});
```


### Envelopes

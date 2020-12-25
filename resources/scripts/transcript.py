import speech_recognition as sr 
import moviepy.editor as mp
import math

CLIP_SIZE=90
FILENAME = r'../resources/videos/1.mp4'

def getVideoTranscript(filename):
  results = []
  video = mp.VideoFileClip(filename)
  duration = video.duration

  print(f'Video Duration: {duration}')

  for i in range((math.floor(duration)//CLIP_SIZE) + 1):
    print(f'Translating Chunk: {i * CLIP_SIZE} - {min(duration, (i + 1) * CLIP_SIZE) - 1}')
    clip = video.subclip(i * CLIP_SIZE, min(duration, ((i + 1) * CLIP_SIZE) - 1))
    clip.audio.write_audiofile(r'converted.wav')

    r = sr.Recognizer()
    audio = sr.AudioFile("converted.wav")

    with audio as source:
      audio_file = r.record(source)
      results.append(r.recognize_google(audio_file))

  with open('recognized.txt',mode ='w') as file: 
    for result in results:
      file.write(result)
      file.write("\n")

getVideoTranscript(FILENAME)
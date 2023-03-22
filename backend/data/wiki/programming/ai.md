# Keras


## Save and load model data
```python
model = keras.models.load_model('path/to/location')
model.save('path/to/location')
```

## Plot history
```python
print(history.history.keys())
plt.plot(history.history['accuracy'])
plt.plot(history.history['val_accuracy'])
```

## Preprocessing
- `keras.preprocessing.image`: load_img
- `keras_cv.layers.Augmenter`: 
    - `keras_cv.layers.CenterCrop`
    - `keras_cv.layers.RandomFlip`
    - `keras_cv.layers.Rescaling`
- `tf.image`
  - `rgb_to_grayscale`

## Sequences
```python
class MyLoader(keras.utils.Sequence):
  def __len__(self):
    ...
  def __getitem__(self, idx):
    ...
```

## Custom Model
```python
class MyModel(keras.Model):
  
```

## Gradient-Tape
Tensorflow has switchted to eager-execution some time ago.
In this mode, no gradient-information is being stored, though.







# Articles

## Word-embedding layers
Convert a word into a vector. Common word embeddings can be downloaded from [here](https://www.deepset.ai/german-word-embeddings)

## Recurrent layers
`o, h_1 = f(i, h_0)`
- `o`: output
- `f`: activation function
- `i`: input
- `h`: hidden state
Recurrent layers are executed one time for each single one of the `n` entries of the input-series; in order.

## Translation
A sequence-to-sequence type of net.
```english -> encoder -> context -> decoder -> german```
Where:
 - context: vector. 
   - Size given at compile-time; commonly 256, 512, or 1024. 
 - encoder: embedding + recurrent nn
 - decoder: recurrent nn + un-embedding

## Attention vs traditional translation-nets
First impression: [here](https://jalammar.github.io/visualizing-neural-machine-translation-mechanics-of-seq2seq-models-with-attention/)

 - Using a fixed size context is an artificial restriction.
 - Instead of having that fixed-size-context, an attention-layer passes to the decoder a weighted sum of the hidden states h0, h1, h2, ... of the encoder.
   - With different weights at each time:
     - `o0 = decoder(w0 * [h0, h1, h2, ...])`
     - `o1 = decoder(w1 * [h0, h1, h2, ...])`
     - ...
 - But this net is still sequential. 
   - Because both the encoder and the decoder are still using simple recurrent layers.

## Self-attention: becoming non-sequential
We can use our own, custom **self**-attention layer to handle multiple steps at the same time.
This means that self-attention is something [completely different](https://datascience.stackexchange.com/questions/49468/whats-the-difference-between-attention-vs-self-attention-what-problems-does-ea) from attention.
Implementing a self-attention layer: [here](https://towardsdatascience.com/illustrated-self-attention-2d627e33b20a).
Really, self-attention-layers are a sequential replacement of recurrent-layers.

## Transformers
First impression: [here](https://jalammar.github.io/illustrated-transformer/)
Tensorflow: [attention](https://www.tensorflow.org/text/tutorials/nmt_with_attention) and [transformers](https://www.tensorflow.org/text/tutorials/transformer)
The transformer is a particular architecture for sequence-to-sequence nets that makes use only of self-attention and fully connected layers,
no convolutional- or recurrent-layers anywhere.
It does have some use-case-specific design which we can mostly ignore.
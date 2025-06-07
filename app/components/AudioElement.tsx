import React from 'react';

const AudioElement = React.forwardRef<
  HTMLAudioElement,
  React.AudioHTMLAttributes<HTMLAudioElement>
>((props, ref) => <audio ref={ref} {...props} />);

AudioElement.displayName = 'AudioElement';

export default AudioElement;

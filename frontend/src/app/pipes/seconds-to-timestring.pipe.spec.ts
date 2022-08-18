import { SecondsToTimestringPipe } from './seconds-to-timestring.pipe';

describe('SecondsToTimestringPipe', () => {
  it('create an instance', () => {
    const pipe = new SecondsToTimestringPipe();
    expect(pipe).toBeTruthy();
  });
});

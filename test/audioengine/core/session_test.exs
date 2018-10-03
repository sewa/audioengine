defmodule Audioengine.Core.SessionTest do
  use ExUnit.Case, async: true

  test "returns the state" do
    sample_host = Audioengine.Core.Session.sample_host()
    assert Audioengine.Core.Session.get() == %{
      instruments: [
        %{
          key: 'sequencer1',
          effects: [
            'filter',
            'delay',
            'distortion',
            'pitch',
            'vibrato',
            'chorus',
            'phaser'
          ],
          samples: [
            "#{sample_host}/samples/sequencer1/1.wav",
            "#{sample_host}/samples/sequencer1/2.wav",
            "#{sample_host}/samples/sequencer1/5.wav",
            "#{sample_host}/samples/sequencer1/3.wav",
          ],
          columns: 16
        }
      ]
    }
  end
end

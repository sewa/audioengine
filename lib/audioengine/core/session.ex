defmodule Audioengine.Core.Session do
  use Agent

  def start_link() do
    Agent.start_link(fn -> %{ state: state() } end, name: __MODULE__)
  end

  def get() do
    Agent.get(__MODULE__, &Map.get(&1, :state))
  end

  def sample_host do
    'http://localhost:8080'
  end

  defp state do
    %{
      instruments: [
        %{
          key: "sequencer1",
          effects: [
            "filter",
            "delay",
            "distortion",
            "pitch",
            "vibrato",
            "chorus",
            "phaser"
          ],
          samples: [
            "#{sample_host()}/samples/sequencer1/1.wav",
            "#{sample_host()}/samples/sequencer1/2.wav",
            "#{sample_host()}/samples/sequencer1/5.wav",
            "#{sample_host()}/samples/sequencer1/3.wav",
            # "./samples/kit_3/5.wav",
            # "./samples/kit_2/5.wav",
            #  "./samples/kit_2/7.wav",
            #  "./samples/kit_2/8.wav"
          ],
          columns: 16
        }
      ]
    }
  end
end

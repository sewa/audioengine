defmodule Audioengine.Core.Clock do
  use Agent

  def start_link() do
    state = %{ timestamp: DateTime.utc_now |> DateTime.to_unix(:millisecond), bpm: 60 }
    Agent.start_link(fn -> %{ state: state } end, name: __MODULE__)
  end

  def get_timestamp() do
    Map.get(get(), :timestamp)
  end

  def get_bpm() do
    Map.get(get(), :bpm)
  end

  def get() do
    Agent.get(__MODULE__, &Map.get(&1, :state))
  end
end

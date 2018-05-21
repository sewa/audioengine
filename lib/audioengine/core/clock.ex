defmodule Audioengine.Core.Clock do
  use Agent

  def start_link() do
    state = %{ time: DateTime.utc_now |> DateTime.to_unix, interval: 1000 }
    Agent.start_link(fn -> %{ state: state } end, name: __MODULE__)
  end

  def get_time() do
    Map.get(get(), :time)
  end

  def get_interval() do
    Map.get(get(), :interval)
  end

  def get() do
    Agent.get(__MODULE__, &Map.get(&1, :state))
  end
end

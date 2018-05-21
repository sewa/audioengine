defmodule Audioengine.Core.ClockTest do
  use ExUnit.Case, async: true

  test "sets the specification" do
    assert Audioengine.Core.Clock.get() == %{
      timestamp: Audioengine.Core.Clock.get_timestamp(),
      bpm: Audioengine.Core.Clock.get_bpm(),
    }
  end
end

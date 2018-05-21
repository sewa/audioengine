defmodule Audioengine.Core.ClockTest do
  use ExUnit.Case, async: true

  test "sets the specification" do
    assert Audioengine.Core.Clock.get() == %{
      time: Audioengine.Core.Clock.get_time(),
      interval: Audioengine.Core.Clock.get_interval(),
    }
  end
end

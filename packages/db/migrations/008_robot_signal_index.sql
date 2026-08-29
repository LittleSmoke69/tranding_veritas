BEGIN;
CREATE UNIQUE INDEX IF NOT EXISTS uq_robot_signal_bar
  ON veritas.robot_signals (instance_id, symbol, bar_time);
COMMIT;

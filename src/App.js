import React, { useState, useEffect } from "react";
import "./output.css";
import { Card, CardContent } from "./components/ui/card";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import InstructionsCard from "./components/InstructionsCard";
import FAQCard from "./components/FAQCard";
import bosses from "./components/bosses";

const getDefaultBossData = () =>
  Object.fromEntries(
    Object.keys(bosses).map((b) => [
      b,
      {
        kills: [],
        killTime: 0,
        storedCommonValue: "",
      },
    ])
  );

export default function App() {
  const [boss, setBoss] = useState("Rasial");
  const [bossData, setBossData] = useState(null);
  const [loaded, setLoaded] = useState(false);

  // UI State
  const [killInput, setKillInput] = useState("1");
  const [dropInput, setDropInput] = useState("");
  const [commonValue, setCommonValue] = useState("");
  const [tempMinutes, setTempMinutes] = useState("");
  const [tempSeconds, setTempSeconds] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [dropPriceInput, setDropPriceInput] = useState("");
  const [importError, setImportError] = useState("");
  const [timeLockedMap, setTimeLockedMap] = useState({});
  const [commonLockedMap, setCommonLockedMap] = useState({});

  // --- Load all bosses from localStorage ---
  useEffect(() => {
    const saved = localStorage.getItem("boss_tracker_data");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setBossData({ ...getDefaultBossData(), ...parsed });
      } catch {
        setBossData(getDefaultBossData());
      }
    } else {
      setBossData(getDefaultBossData());
    }
    setLoaded(true);
  }, []);

  // --- Save all bosses to localStorage whenever bossData changes ---
  useEffect(() => {
    if (!loaded || !bossData) return;
    localStorage.setItem("boss_tracker_data", JSON.stringify(bossData));
  }, [bossData, loaded]);

  // --- Sync UI state when boss or bossData changes ---
  useEffect(() => {
    if (!bossData) return;
    const { killTime = 0, storedCommonValue = "" } = bossData[boss] || {};
    setTempMinutes(killTime ? Math.floor(killTime / 60).toString() : "");
    setTempSeconds(killTime ? (killTime % 60).toString() : "");
    setTimeLockedMap((prev) => ({ ...prev, [boss]: !!killTime }));
    setCommonLockedMap((prev) => ({
      ...prev,
      [boss]: storedCommonValue !== "",
    }));
    setCommonValue("");
    setDropInput("");
    setErrorMessage("");
    setKillInput(
      bossData[boss]?.kills.length > 0
        ? (Math.max(...bossData[boss].kills.map((k) => k.kill)) + 1).toString()
        : "1"
    );
  }, [boss, bossData]);

  // --- Handlers ---
  const handleAddDrop = () => {
    if (!dropInput) {
      setErrorMessage("Please select a drop.");
      return;
    }
    if (Number(dropPriceInput) < 0) {
      setErrorMessage("Sale price cannot be negative.");
      return;
    }
    const killNumber = Number(killInput);
    const kills = bossData[boss]?.kills || [];
    const lastDropKill = kills.reduce(
      (max, k) => (k.drop ? Math.max(max, k.kill) : max),
      0
    );
    if (killNumber <= lastDropKill) {
      setErrorMessage(
        `You can't add a drop with a kill count less than or equal to your last drop (#${lastDropKill}).`
      );
      return;
    }
    const newKills = [
      ...kills,
      { kill: killNumber, drop: dropInput, value: Number(dropPriceInput) },
    ];
    setBossData((prev) => ({
      ...prev,
      [boss]: { ...prev[boss], kills: newKills },
    }));
    setKillInput((killNumber + 1).toString());
    setDropInput("");
    setDropPriceInput("");
    setErrorMessage("");
  };

  const handleDeleteKill = (index) => {
    const kills = bossData[boss]?.kills || [];
    const newKills = [...kills];
    newKills.splice(index, 1);
    setBossData((prev) => ({
      ...prev,
      [boss]: { ...prev[boss], kills: newKills },
    }));
  };

  const handleSetKillTime = () => {
    const totalSeconds = Number(tempMinutes) * 60 + Number(tempSeconds);
    setBossData((prev) => ({
      ...prev,
      [boss]: { ...prev[boss], killTime: totalSeconds },
    }));
    setTimeLockedMap((prev) => ({ ...prev, [boss]: true }));
  };

  const handleEditKillTime = () => {
    setTimeLockedMap((prev) => ({ ...prev, [boss]: false }));
  };

  const handleSetCommonValue = () => {
    setBossData((prev) => ({
      ...prev,
      [boss]: { ...prev[boss], storedCommonValue: commonValue },
    }));
    setCommonLockedMap((prev) => ({ ...prev, [boss]: true }));
  };

  const handleEditCommonValue = () => {
    setCommonLockedMap((prev) => ({ ...prev, [boss]: false }));
  };

  // --- Save Code Import ---
  const handleImportSaveCode = (imported) => {
    setBossData({ ...getDefaultBossData(), ...imported });
    setImportError("");
  };

  if (!bossData) return null;
  const kills = bossData[boss]?.kills || [];
  const killTime = bossData[boss]?.killTime || 0;
  const storedCommonValue = bossData[boss]?.storedCommonValue || "";
  const commonLocked = commonLockedMap[boss] || false;
  const timeLocked = timeLockedMap[boss] || false;

  const totalGP =
    kills.reduce((sum, k) => sum + (k.value || 0), 0) +
    Number(storedCommonValue || 0);

  const lastKillNumber =
    kills.length > 0 ? Math.max(...kills.map((k) => k.kill)) : 0;
  const totalTime = lastKillNumber * killTime;
  const gpPerHour =
    totalTime > 0 ? (totalGP / (totalTime / 3600)).toFixed(0) : 0;
  const gpPerKill =
    lastKillNumber > 0 ? (totalGP / lastKillNumber).toFixed(0) : 0;

  const calculateDryStreaks = (kills) => {
    const streaks = [];
    let lastDropKill = null;
    kills.forEach((k) => {
      if (k.drop) {
        const streak = lastDropKill === null ? k.kill : k.kill - lastDropKill;
        streaks.push(streak);
        lastDropKill = k.kill;
      } else {
        streaks.push(null);
      }
    });
    return streaks;
  };

  const dryStreaks = calculateDryStreaks(kills);
  const getDryStreakColor = (streak) => {
    if (streak === null) return "";
    const totalDropRate = bosses[boss].drops.reduce(
      (sum, drop) => sum + drop.rate,
      0
    );
    const avgDropChance = 1 / totalDropRate;
    if (streak <= avgDropChance) return "text-green-600"; // lucky
    if (streak <= 2 * avgDropChance) return "text-orange-500"; // dry
    return "text-red-700 font-bold"; // very dry
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 space-y-6">
      <div className="flex flex-col items-center gap-2">
        <div className="w-full max-w-xl mx-auto"></div>
        <h1 className="text-3xl font-bold text-center text-gray-800">
          Boss Profit Tracker
        </h1>
        <div className="flex gap-4 items-center">
          <select
            className="p-2 rounded border border-gray-300 bg-white shadow-sm"
            value={boss}
            onChange={(e) => setBoss(e.target.value)}
          >
            {Object.keys(bosses).map((b) => (
              <option key={b} value={b}>
                {bosses[b].fullName}
              </option>
            ))}
          </select>

          <div className="flex gap-2 items-center">
            <Input
              type="number"
              placeholder="Min"
              value={tempMinutes}
              onChange={(e) => setTempMinutes(e.target.value)}
              disabled={timeLocked}
              className="w-16"
            />
            <span>:</span>
            <Input
              type="number"
              placeholder="Sec"
              value={tempSeconds}
              onChange={(e) => setTempSeconds(e.target.value)}
              disabled={timeLocked}
              className="w-16"
            />
            <Button onClick={handleSetKillTime} disabled={timeLocked}>
              Set
            </Button>
            {timeLocked && (
              <Button variant="outline" onClick={handleEditKillTime}>
                Edit Time
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="flex w-full min-h-screen max-w-7xl mx-auto items-start justify-center gap-8 px-4">
        <InstructionsCard
          bossData={bossData}
          importError={importError}
          setImportError={setImportError}
          onImport={handleImportSaveCode}
        />
        <div className="flex-1 flex justify-center w-full max-w-2x1">
          {/* Main Card */}
          <Card>
            <CardContent className="pt-4">
              <div className="flex gap-2">
                <Input
                  type="number"
                  placeholder="Kill #"
                  value={killInput}
                  onChange={(e) => setKillInput(e.target.value)}
                  className="w-20 h-10"
                />
                <select
                  className="p-2 rounded bg-gray-100 h-10 w-80"
                  value={dropInput}
                  onChange={(e) => setDropInput(e.target.value)}
                >
                  <option value="">Select drop</option>
                  {bosses[boss].drops.map((d, i) => (
                    <option key={i} value={d.name}>
                      {d.name}
                    </option>
                  ))}
                </select>
                <Input
                  type="number"
                  placeholder="Sale price"
                  value={dropPriceInput}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === "" || Number(value) >= 0) {
                      setDropPriceInput(value);
                      setErrorMessage("");
                    } else {
                      setErrorMessage("Sale price cannot be negative.");
                    }
                  }}
                  className="w-32 h-10"
                />
                <Button
                  onClick={handleAddDrop}
                  disabled={!dropInput || !dropPriceInput}
                  className="w-16 h-14"
                >
                  Add Drop
                </Button>
              </div>
              {errorMessage && (
                <div className="text-red-500 text-sm font-medium mt-1">
                  {errorMessage}
                </div>
              )}

              {(boss === "Nakatra" || boss === "GateOfElidinis") && (
                <div className="flex gap-2 items-center mt-2">
                  <Input
                    type="number"
                    placeholder="Common GP"
                    value={commonLocked ? storedCommonValue : commonValue}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value === "" || Number(value) >= 0) {
                        setCommonValue(value);
                        setErrorMessage("");
                      } else {
                        setErrorMessage(
                          "Common drops value cannot be negative."
                        );
                      }
                    }}
                    disabled={commonLocked}
                  />
                  <select
                    className="p-2 rounded bg-gray-200 text-gray-500"
                    disabled
                  >
                    <option>Common drops value</option>
                  </select>
                  <Button
                    onClick={handleSetCommonValue}
                    disabled={commonLocked}
                  >
                    Set
                  </Button>
                  {commonLocked && (
                    <Button variant="outline" onClick={handleEditCommonValue}>
                      Edit
                    </Button>
                  )}
                </div>
              )}

              <div className="space-y-1">
                <div>Total GP: {totalGP.toLocaleString()}</div>
                <div>GP / Kill: {parseInt(gpPerKill).toLocaleString()}</div>
                <div>GP / Hour: {parseInt(gpPerHour).toLocaleString()}</div>
              </div>

              <div className="pt-4">
                <h2 className="text-lg font-semibold mb-2 border-b pb-1">
                  Drop Log
                </h2>
                <table className="w-full text-sm text-left border border-gray-200 shadow-sm rounded-xl overflow-hidden">
                  <thead>
                    <tr className="text-left border-b">
                      <th className="py-1">Dry Streak</th>
                      <th className="py-1">Kill #</th>
                      <th className="py-1">Drop</th>
                      <th className="py-1">Price</th>
                      <th className="py-1"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {kills.map((k, index) => {
                      // eslint-disable-next-line
                      const drop = bosses[boss].drops.find(
                        (d) => d.name === k.drop
                      );
                      return (
                        <tr key={index} className="border-b">
                          <td
                            className={`py-1 font-semibold ${getDryStreakColor(
                              dryStreaks[index]
                            )}`}
                          >
                            {dryStreaks[index] !== null
                              ? dryStreaks[index]
                              : ""}
                          </td>
                          <td className="py-1">{k.kill}</td>
                          <td className="py-1">{k.drop || "No drop"}</td>
                          <td className="py-1">
                            {k.value ? k.value.toLocaleString() : "0"}
                          </td>
                          <td className="py-1">
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDeleteKill(index)}
                            >
                              Delete
                            </Button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
        <FAQCard />
      </div>
    </div>
  );
}

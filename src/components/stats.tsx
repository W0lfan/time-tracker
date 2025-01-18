import { useEffect, useState } from "react";
import { Dispatch, SetStateAction } from "react";

const getLocalStorage = () => {
    const t = localStorage.getItem('time_working');
    if (t) {
        return JSON.parse(t);
    } else {
        localStorage.setItem('time_working', JSON.stringify({}));
    }
    return {};
}

const updateLocalStorageInMilliseconds = (date: string, time: number, notes: string | null, feeling: string | null) => {
    const t = getLocalStorage();
    if (!t[date]) {
        t[date] = [];
    }
    t[date].push({
        time: time,
        notes: notes,
        feeling: feeling,
    });
    localStorage.setItem('time_working', JSON.stringify(t));
}

interface StatsProps {
    update: boolean;
    setUpdate: Dispatch<SetStateAction<boolean>>;
}

const calculateStats = (data: { [key: string]: { time: number; feeling: string | null }[] }) => {
    let totalTime = 0;
    let totalFeeling = 0;
    let totalEntries = 0;

    Object.values(data).forEach((dayEntries) => {
        dayEntries.forEach((entry) => {
            totalTime += entry.time;
            if (entry.feeling) {
                totalFeeling += parseInt(entry.feeling, 10); // Convert feeling to number if stored as string
                totalEntries++;
            }
        });
    });

    const averageFeeling = totalEntries > 0 ? (totalFeeling / totalEntries).toFixed(2) : "N/A";
    const totalTimeInHours = (totalTime / (1000 * 60 * 60)).toFixed(2);

    return {
        totalTimeInHours,
        averageFeeling,
        totalTime,
    };
};

const Stats: React.FC<StatsProps> = ({ update, setUpdate }) => {
    const [loc, setLoc] = useState(getLocalStorage());
    const [stats, setStats] = useState({ totalTimeInHours: "0.00", averageFeeling: "N/A", totalTime: 0 });
    const [lastNote, setLastNote] = useState(
        loc[Object.keys(loc)[Object.keys(loc).length - 1]][
            loc[Object.keys(loc)[Object.keys(loc).length - 1]].length - 1
        ].notes
    );

    useEffect(() => {
        if (update) {
            const updatedLoc = getLocalStorage();
            setLoc(updatedLoc);
            setStats(calculateStats(updatedLoc));
            setLastNote(
                updatedLoc[Object.keys(updatedLoc)[Object.keys(updatedLoc).length - 1]][
                    updatedLoc[Object.keys(updatedLoc)[Object.keys(updatedLoc).length - 1]].length - 1
                ].notes
            )
            setUpdate(false);
        }
    }, [update]);

    useEffect(() => {
        setStats(calculateStats(loc));
    }, [loc]);

    return (
        <div className="stats-container">
            <div className="stats-content">
                <div className="stats-row">
                    <div className="stats-row-title">Total Time Worked</div>
                    <div className="stats-row-content">
                        {stats.totalTimeInHours} hours
                    </div>
                </div>
                <div className="stats-row">
                    <div className="stats-row-title">Days Worked</div>
                    <div className="stats-row-content">
                        {Object.keys(loc).length}
                    </div>
                </div>
                <div className="stats-row">
                    <div className="stats-row-title">Average Time Worked</div>
                    <div className="stats-row-content">
                        {Object.keys(loc).length > 0 ? (stats.totalTime / Object.keys(loc).length / (1000 * 60 * 60)).toFixed(2) : 0} hours
                    </div>
                </div>
                {
                    lastNote && (
                        <div className="stats-row notes">
                            <div className="stats-row-title">Last Note</div>
                            <div className="stats-row-content">
                                {lastNote}
                            </div>
                        </div>
                    )
                }
            </div>
        </div>
    );
};

export { getLocalStorage, updateLocalStorageInMilliseconds };
export default Stats;

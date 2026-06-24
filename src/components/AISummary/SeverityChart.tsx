"use client";

import BarList from "./BarList";

interface Props {
    severity: Record<string, number>;
}

export default function SeverityChart({
    severity
}: Props) {

    const sortedData =
        Object.entries(severity)
            .sort((a, b) => b[1] - a[1]);

    return (
        <BarList
            title="Failures by Severity"
            items={sortedData}
            color="#DD6B20"
        />
    );
}
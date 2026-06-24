"use client";

import BarList from "./BarList";

interface Props {
    categories: Record<string, number>;
}

export default function FailureCategoryChart({
    categories
}: Props) {

    const sortedData =
        Object.entries(categories)
            .sort((a, b) => b[1] - a[1]);

    return (
        <BarList
            title="Failure Categories"
            items={sortedData}
            color="#E53E3E"
        />
    );
}
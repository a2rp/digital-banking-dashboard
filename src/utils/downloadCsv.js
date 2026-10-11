const csvValue = (value) => {
    const text = String(value ?? "");
    return '"' + text.replaceAll('"', '""') + '"';
};

export const downloadCsv = (filename, headers, rows) => {
    const body = [headers, ...rows]
        .map((row) => row.map(csvValue).join(","))
        .join("\r\n");
    const file = new Blob([body], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(file);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.append(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
};
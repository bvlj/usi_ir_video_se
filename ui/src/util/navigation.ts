export function openUrl(url: string, newTab = false) {
    const a = document.createElement("a");
    a.style.display = "none";
    a.href = url;
    if (newTab) {
        a.target = "_blank";
        a.rel = "noopener noreferrer";
    }
    a.click();
    a.remove();
}
import React from 'react';
const jumpLink = (link: string | null) => {
    if (link) window.location.href = link
}
const toast = (text: string, position = 'middle') => {
    window.plugTool.Jtoast(`<div style="white-space:nowrap">${text}</div>`, position)
}
const Tool = {
    jumpLink,toast
}
React.__tool = Tool
export default Tool
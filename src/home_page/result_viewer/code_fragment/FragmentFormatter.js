import React from 'react';

import {GroupMatchesStruct} from 'home_page/ResultStruct.js';

import style from 'home_page/result_viewer/code_fragment/CodeFragment.module.css';

/**
 * The algorithm does not use the `text` in matches. 
 * Also, assumes that would be fragmentSpan != null and fragmentSpan.absolute == true.
 * 
 * Note: The `GroupMatchesStruct` object is modified.
 * 
 * @param {!GroupMatchesStruct} groupMatches
 * @return {!Array<!<p>>}
 */
function computeSplitedAndHighlitedFragment(groupMatches) {
  // Sort the matches to appear in order by the first in appear (start smallest)
  // first. Then, by the most longest one (end biggest).
  groupMatches.matches.sort((a, b) => {
    const diff = a.fragmentSpan.startAbs - b.fragmentSpan.startAbs;
    if (diff === 0) {
      return -(a.fragmentSpan.endAbs - b.fragmentSpan.endAbs);
    }
    return diff;
  });
  // Join the overlapping and adjacent matches.
  for (let i = 0; i < groupMatches.matches.length; i++) {
    const j = i + 1;
    while (j < groupMatches.matches.length) {
      if (groupMatches.matches[i].fragmentSpan.endAbs >=
        groupMatches.matches[j].fragmentSpan.startAbs) {
        // Because the end is exclusive, it makes sense to join them if
        // i.end==j.start because they are highligth neighbors.
        groupMatches.matches[i].fragmentSpan.endAbs = 
          groupMatches.matches[j].fragmentSpan.endAbs;
        groupMatches.matches.splice(j, 1);
      } else {
        break;
      }
    }
  }

  // There should be always an ending new line.
  if (groupMatches.fragment.charAt(groupMatches.fragment.length) !== "\n") {
    groupMatches.fragment += "\n";
  }

  // TODO: Reformat this code removing the while(true) with breaks everywhere,
  // having better at the beginning of each line grabbing the the first chunk
  // of not highlight.
  const paragraphs = [];
  let lastNewLine = -1;
  let nextMatch = 0;
  let indexNewLine = groupMatches.fragment.indexOf("\n");
  while (indexNewLine !== -1) {
    const nextSpans = [];
    let lastPosInLine = lastNewLine;
    while (true) {
      if (nextMatch < groupMatches.matches.length &&
        groupMatches.matches[nextMatch].fragmentSpan.startAbs < indexNewLine) {
        nextSpans.push(
          <span key={nextSpans.length.toString()} className={"span-text"}>{
            groupMatches.fragment.substring(
              lastPosInLine + 1, 
              groupMatches.matches[nextMatch].fragmentSpan.startAbs,
            )
          }</span>
        );

        // Now lets create the span for the actual highlight, checking if it ends
        // before the endline.
        if (groupMatches.matches[nextMatch].fragmentSpan.endAbs <= indexNewLine) {
          nextSpans.push(
            <span key={nextSpans.length.toString()} className={style.spanHighlight}>{
              groupMatches.fragment.substring(
                groupMatches.matches[nextMatch].fragmentSpan.startAbs,
                groupMatches.matches[nextMatch].fragmentSpan.endAbs,
              )
            }</span>
          );
          lastPosInLine = groupMatches.matches[nextMatch].fragmentSpan.endAbs - 1;

          if (groupMatches.matches[nextMatch].fragmentSpan.endAbs === indexNewLine) {
            // To avoid creating an empty span at the end, let's quit since here.
            break;
          }

          // This match was already completed.
          nextMatch++;
        } else {
          // Lets grab until the end of the line and not remove the match, to leave it
          // to complete its "highlighting" in the next line(s).
          nextSpans.push(
            <span key={nextSpans.length.toString()} className={style.spanHighlight}>{
              groupMatches.fragment.substring(
                groupMatches.matches[nextMatch].fragmentSpan.startAbs,
                indexNewLine,
              )
            }</span>
          );

          // Because the sorting and joining above, we don't need to reset the
          // `lastPosInLine`; we arrived to the end of line.
          break;
        }
      } else {
        // Let's take all the line exactly like that and keep the match for the next time.
        const content = groupMatches.fragment.substring(lastPosInLine + 1, indexNewLine);
        nextSpans.push(
          <span key={nextSpans.length.toString()} className={"span-text"}>{
            // If the line is empty, lets put something to hold the space.
            // Also, use space instead of "&nbsp;" because we use "pre"-like style.
            content.length === 0 && nextSpans.length === 0 ? " " : content
          }</span>
        );

        break;
      }
    }
    paragraphs.push(
      <p key={paragraphs.length.toString()} className={style.codeLine}>{nextSpans}</p>
    );

    lastNewLine = indexNewLine;
    indexNewLine = groupMatches.fragment.indexOf("\n", lastNewLine + 1);
  }

  return paragraphs;
}

export {computeSplitedAndHighlitedFragment};

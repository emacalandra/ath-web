with open('script.js', 'r', encoding='utf-8') as f:
    js = f.read()

import re

# In renderWidgetDayTimelineGrid, we have a loop for creating the slots.
# Let's see the loop:
match = re.search(r'(for\s*\(let\s*m\s*=\s*startOfDayMins.*?gridContainer\.innerHTML\s*\+=\s*html;\s*\})', js, re.DOTALL)
if match:
    # print(match.group(1))
    old_loop = match.group(1)
    # We will inject logic to grey out past times
    new_loop = old_loop.replace('let isAvailable = true;', '''let isAvailable = true;
                const dNow = new Date();
                const dNowStr = ${dNow.getFullYear()}--;
                const isPast = (currentWidgetDate < dNowStr) || (currentWidgetDate === dNowStr && m < (dNow.getHours() * 60 + dNow.getMinutes()));
                ''')
    
    # Also disable clicking on them. Wait, clicking is handled in the timeline click listener?
    # No, we can just add a class or style if isPast.
    
    new_loop = new_loop.replace('html += \n                    <span class="occupancy-slot-pill free" onclick="', 
                                'html += \\n                    <span class="occupancy-slot-pill free " ')
    
    new_loop = new_loop.replace('selectTimeSlotFromTimeline(\'\')"', 'selectTimeSlotFromTimeline(\'\')\" + (isPast ? ` : >)')
    
    # Actually that's too hacky. Let's just do:
    # if (isPast) html += <span class="occupancy-slot-pill free" style="opacity:0.3; cursor:not-allowed;"></span>;
    # else html += ...
    
    print("Found loop!")
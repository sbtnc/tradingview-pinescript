// This source code is subject to the terms of the Mozilla Public License 2.0 at https://mozilla.org/MPL/2.0/
// © sbtnc

//@version=4
study("ATR Daily Levels", shorttitle = "ATR", overlay = true)

[day_high, day_low, day_time, day_atr] = security(syminfo.tickerid,
     'D',
     [high, low, time, atr(20)[1]],
     lookahead = barmerge.lookahead_on)

//------------------------------ Inputs -------------------------------

var atr_period_input = input(defval = 20, title = "Length", type = input.integer)
var atr_start_offset = input(defval = true, title = "Show Start Offset", type = input.bool)

//------------------------------ Config ------------------------------

var DEFAULT_COLOR = color.gray
var DEFAULT_HIGHLIGHT_COLOR = color.new(DEFAULT_COLOR, 70)
var DEFAULT_OFFSET_START = 1
var DEFAULT_LINE_STYLE = line.style_dotted
var DEFAULT_LINE_WIDTH = 2
var DEFAULT_LINE_LENGTH = 8
var DEFAULT_LABEL_STYLE = label.style_label_left
var DEFAULT_LABEL_COLOR = color(na)

//------------------------------ Plotting ------------------------------

// truncates a given number per symbol's default precision
truncatePerSymbolPrecision(number) =>
    decimals = abs(log10(syminfo.mintick))
    factor = pow(10, decimals)
    int(number * factor) / factor
    
can_display_timeframe = not (timeframe.isweekly or timeframe.ismonthly)

if barstate.islast and can_display_timeframe
    atr_high = day_low + day_atr
    atr_low = day_high - day_atr
    
    var bar = time - time[1]
    offset = time + bar * DEFAULT_OFFSET_START
    level_start = atr_start_offset ? offset : day_time
    level_end = atr_start_offset ? level_start + bar * DEFAULT_LINE_LENGTH : offset + bar * DEFAULT_LINE_LENGTH
    
    // when price is passed a ATR, the level is highlighted 
    level_high_color = day_high > atr_high ? DEFAULT_HIGHLIGHT_COLOR : DEFAULT_COLOR
    level_low_color = day_low < atr_low ? DEFAULT_HIGHLIGHT_COLOR : DEFAULT_COLOR
    
    // draw on init
    
    var atr_high_line = line.new(x1 = level_start,
     x2 = level_end,
     y1 = atr_high,
     y2 = atr_high,
     xloc = xloc.bar_time,
     style = DEFAULT_LINE_STYLE,
     color = level_high_color,
     width = DEFAULT_LINE_WIDTH)
    
    var atr_low_line = line.new(x1 = level_start,
     x2 = level_end,
     y1 = atr_low,
     y2 = atr_low,
     xloc = xloc.bar_time,
     style = DEFAULT_LINE_STYLE,
     color = level_low_color,
     width = DEFAULT_LINE_WIDTH)

    atr_high_text = tostring(truncatePerSymbolPrecision(atr_high)) + " (" + tostring(truncatePerSymbolPrecision(day_atr)) + ")"
    atr_low_text = tostring(truncatePerSymbolPrecision(atr_low))

    var atr_high_label = label.new(x = level_end,
     y = atr_high,
     text = atr_high_text,
     xloc = xloc.bar_time,
     color = DEFAULT_LABEL_COLOR,
     style = DEFAULT_LABEL_STYLE,
     textcolor = level_high_color)
    
    var atr_low_label = label.new(x = level_end,
     y = atr_low,
     text = atr_low_text,
     xloc = xloc.bar_time,
     color = DEFAULT_LABEL_COLOR,
     style = DEFAULT_LABEL_STYLE,
     textcolor = level_low_color)

    // re-draw on update
    
    line.set_x1(atr_high_line, level_start)
    line.set_x2(atr_high_line, level_end)
    line.set_y1(atr_high_line, atr_high)
    line.set_y2(atr_high_line, atr_high)
    
    line.set_x1(atr_low_line, level_start)
    line.set_x2(atr_low_line, level_end)
    line.set_y1(atr_low_line, atr_low)
    line.set_y2(atr_low_line, atr_low)
    
    label.set_x(atr_high_label, level_end)
    label.set_y(atr_high_label, atr_high)
    label.set_text(atr_high_label, atr_high_text)
    
    label.set_x(atr_low_label, level_end)
    label.set_y(atr_low_label, atr_low)
    label.set_text(atr_low_label, atr_low_text)
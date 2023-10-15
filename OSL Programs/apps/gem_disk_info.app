def "calculate_write"
temp = timestamp
endef

mainloop:

window "dimensions" window_width window_width * 0.6
image "https://raw.githubusercontent.com/Mistium/Origin-OS/main/OSL%20Programs/assets/gem_disk_info_bg.png" window_width


loc 2 2 20 -40
text "Disk:" + disk_name 20 : c#fff

loc 2 2 20 -100
text "Read:" + disk_read_speed 9

loc 2 2 20 -130
text "Write:" + disk_write_speed 9

loc 2 2 20 -160
text "Total Bytes Written:" + disk_total_writes 9

loc 2 2 20 -200
text "Installed Disks:" + newline ++ disks.getall("name").join(newline) 9

import "win-buttons"
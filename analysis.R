rm(list=ls())

# please set the correct working directory to the simulation data files
setwd("~/Documents/SUTD/Term 6/SMA/Project")



sim1 <- read.csv("sim1.csv")
sim2 <- read.csv("sim2.csv")
sim3 <- read.csv("sim3.csv")
sim4 <- read.csv("sim4.csv")
sim5 <- read.csv("sim5.csv")
sim6 <- read.csv("sim6.csv")
sim7 <- read.csv("sim7.csv")
sim8 <- read.csv("sim8.csv")
sim9 <- read.csv("sim9.csv")
sim10 <- read.csv("sim10.csv")

sim_1 <- read.csv("sim1_12rides.csv")
sim_2 <- read.csv("sim2_12rides.csv")
sim_3 <- read.csv("sim3_12rides.csv")
sim_4 <- read.csv("sim4_12rides.csv")
sim_5 <- read.csv("sim5_12rides.csv")


# compare average waiting time
wait1 <- sim1[, c(1, 3)]
wait2 <- sim2[, c(1, 3)]
wait3 <- sim3[, c(1, 3)]
wait4 <- sim4[, c(1, 3)]
wait5 <- sim5[, c(1, 3)]
wait6 <- sim6[, c(1, 3)]
wait7 <- sim7[, c(1, 3)]
wait8 <- sim8[, c(1, 3)]
wait9 <- sim9[, c(1, 3)]
wait10 <- sim10[, c(1, 3)]


wait_1 <- sim_1[, c(1, 3)]
wait_2 <- sim_2[, c(1, 3)]


plot(wait1, type = "l", main = "sim1")
plot(wait2, type = "l", main = "sim2")
plot(wait3, type = "l", main = "sim3")
plot(wait4, type = "l", main = "sim4")
plot(wait5, type = "l", main = "sim5")
plot(wait6, type = "l", main = "sim6")
plot(wait7, type = "l", main = "sim7")
plot(wait8, type = "l", main = "sim8")
plot(wait9, type = "l", main = "sim9")
plot(wait10, type = "l", main = "sim10")

plot(wait_1, type = "l")
plot(wait_2, type = "l")


mean(sim1$avg_wait_time)
mean(sim2$avg_wait_time)
mean(sim3$avg_wait_time)
mean(sim4$avg_wait_time)
mean(sim5$avg_wait_time)
mean(sim6$avg_wait_time)
mean(sim7$avg_wait_time)
mean(sim8$avg_wait_time)
mean(sim9$avg_wait_time)
mean(sim10$avg_wait_time)

mean(sim_1$avg_wait_time)
mean(sim_2$avg_wait_time)


# remove initialisation bias
wait1 <- subset(wait1, wait1$time >= 300)
wait2 <- subset(wait2, wait2$time >= 300)
wait3 <- subset(wait3, wait3$time >= 300)
wait4 <- subset(wait4, wait4$time >= 300)
wait5 <- subset(wait5, wait5$time >= 300)
wait6 <- subset(wait6, wait6$time >= 300)
wait7 <- subset(wait7, wait7$time >= 300)
wait8 <- subset(wait8, wait8$time >= 300)
wait9 <- subset(wait9, wait9$time >= 300)
wait10 <- subset(wait10, wait10$time >= 300)


wait_1 <- subset(wait_1, wait_1$time >= 300)
wait_2 <- subset(wait_2, wait_2$time >= 300)


plot(wait_1$avg_wait_time, type = "l")
plot(wait_2$avg_wait_time, type = "l")


mean_vals <- c()
mean_vals <- append(mean_vals, mean(wait1$avg_wait_time))
mean_vals <- append(mean_vals, mean(wait2$avg_wait_time))
mean_vals <- append(mean_vals, mean(wait3$avg_wait_time))
mean_vals <- append(mean_vals, mean(wait4$avg_wait_time))
mean_vals <- append(mean_vals, mean(wait5$avg_wait_time))
mean_vals <- append(mean_vals, mean(wait6$avg_wait_time))
mean_vals <- append(mean_vals, mean(wait7$avg_wait_time))
mean_vals <- append(mean_vals, mean(wait8$avg_wait_time))
mean_vals <- append(mean_vals, mean(wait9$avg_wait_time))
mean_vals <- append(mean_vals, mean(wait10$avg_wait_time))
mean_vals

plot(wait1, type = "l")
plot(wait2, type = "l")

mean(wait1$avg_wait_time)




# compare time in park
time1 <- sim1[, c(1, 6)]
time2 <- sim2[, c(1, 6)]
time3 <- sim3[, c(1, 6)]
time4 <- sim4[, c(1, 6)]
time5 <- sim5[, c(1, 6)]
time6 <- sim6[, c(1, 6)]
time7 <- sim7[, c(1, 6)]
time8 <- sim8[, c(1, 6)]


plot(time1, type = "l")
plot(time2, type = "l")





# faction of missed visitors
plot(sim8$agts_left, type = "l")
plot(sim4$agts_left, type = "l")
plot(sim9$agts_left, type = "l")
plot(sim10$agts_left, type = "l")

plot(sim8$time, sim8$agts_left, type = "l")
plot(sim4$time, sim4$agts_left, type = "l")
plot(sim9$time, sim9$agts_left, type = "l")
plot(sim10$time, sim10$agts_left, type = "l")
plot(sim1$time, sim1$agts_left, type = "l")
plot(sim3$time, sim3$agts_left, type = "l")



plot(sim_1$time, sim_1$agts_left, type = "l")
plot(sim_2$time, sim_2$agts_left, type = "l")
plot(sim_3$time, sim_3$agts_left, type = "l")
plot(sim_4$time, sim_4$agts_left, type = "l")
plot(sim_5$time, sim_5$agts_left, type = "l")


missed8 <- subset(sim8, sim8$time >= 600)
missed4 <- subset(sim4, sim4$time >= 600)
missed9 <- subset(sim9, sim9$time >= 600)
missed1 <- subset(sim1, sim1$time >= 600)
missed3 <- subset(sim3, sim3$time >= 600)


missed8 <- missed8[, c(1, 4)]
missed4 <- missed4[, c(1, 4)]
missed9 <- missed9[, c(1, 4)]
missed1 <- missed1[, c(1, 4)]
missed3 <- missed3[, c(1, 4)]


missed_1 <- subset(sim_1, sim_1$time >= 600)
missed_2 <- subset(sim_2, sim_2$time >= 600)
missed_3 <- subset(sim_3, sim_3$time >= 600)
missed_4 <- subset(sim_4, sim_4$time >= 600)
missed_5 <- subset(sim_5, sim_5$time >= 600)

missed_1 <- missed_1[, c(1, 4)]
missed_2 <- missed_2[, c(1, 4)]
missed_3 <- missed_3[, c(1, 4)]
missed_4 <- missed_4[, c(1, 4)]
missed_5 <- missed_4[, c(1, 4)]


A_missed <- c()
A_missed <- append(A_missed, mean(missed8$agts_left))
A_missed <- append(A_missed, mean(missed4$agts_left))
A_missed <- append(A_missed, mean(missed9$agts_left))
A_missed <- append(A_missed, mean(missed1$agts_left))
A_missed <- append(A_missed, mean(missed3$agts_left))


mean(missed8$agts_left)
mean(missed4$agts_left)
mean(missed9$agts_left)
mean(missed1$agts_left)
mean(missed3$agts_left)


mean(missed_1$agts_left)
mean(missed_2$agts_left)
mean(missed_3$agts_left)
mean(missed_4$agts_left)
mean(missed_5$agts_left)


B_missed <- c()
B_missed <- append(B_missed, mean(missed_1$agts_left))
B_missed <- append(B_missed, mean(missed_2$agts_left))
B_missed <- append(B_missed, mean(missed_3$agts_left))
B_missed <- append(B_missed, mean(missed_4$agts_left))
B_missed <- append(B_missed, mean(missed_5$agts_left))

paired_missed <- A_missed - B_missed
t.test(paired_missed)


# paired difference in ride waiting time
waitp1 <- mean(wait8$avg_wait_time)
waitp2 <- mean(wait4$avg_wait_time)
waitp3 <- mean(wait9$avg_wait_time)
waitp4 <- mean(wait9$avg_wait_time)
waitp5 <- mean(wait3$avg_wait_time)

waitp <- c()
waitp <- append(waitp, waitp1)
waitp <- append(waitp, waitp2)
waitp <- append(waitp, waitp3)
waitp <- append(waitp, waitp4)
waitp <- append(waitp, waitp5)

mean(waitp)
var(waitp)


wait_1 <- subset(sim_1, sim_1$time >= 600)
wait_2 <- subset(sim_2, sim_2$time >= 600)
wait_3 <- subset(sim_3, sim_3$time >= 600)
wait_4 <- subset(sim_4, sim_4$time >= 600)
wait_5 <- subset(sim_5, sim_5$time >= 600)

wait_1 <- wait_1[, c(1, 3)]
wait_2 <- wait_2[, c(1, 3)]
wait_3 <- wait_3[, c(1, 3)]
wait_4 <- wait_4[, c(1, 3)]
wait_5 <- wait_5[, c(1, 3)]


wait_p1 <- mean(wait_1$avg_wait_time)
wait_p2 <- mean(wait_2$avg_wait_time)
wait_p3 <- mean(wait_3$avg_wait_time)
wait_p4 <- mean(wait_4$avg_wait_time)
wait_p5 <- mean(wait_5$avg_wait_time)

wait_p <- c()
wait_p <- append(wait_p, wait_p1)
wait_p <- append(wait_p, wait_p2)
wait_p <- append(wait_p, wait_p3)
wait_p <- append(wait_p, wait_p4)
wait_p <- append(wait_p, wait_p5)

paired_wait <- waitp - wait_p
paired_wait



# average time spent in park per visitor
park1 <- sim8[, c(1, 6)]
park2 <- sim3[, c(1, 6)]
park3 <- sim4[, c(1, 6)]
park4 <- sim9[, c(1, 6)]
park5 <- sim6[, c(1, 6)]

park_1 <- sim_1[, c(1, 6)]
park_2 <- sim_2[, c(1, 6)]
park_3 <- sim_3[, c(1, 6)]
park_4 <- sim_4[, c(1, 6)]
park_5 <- sim_5[, c(1, 6)]

park1 <- subset(park1, park1$time >= 600)
park2 <- subset(park2, park2$time >= 600)
park3 <- subset(park3, park3$time >= 600)
park4 <- subset(park4, park4$time >= 600)
park5 <- subset(park5, park5$time >= 600)

park_1 <- subset(park_1, park_1$time >= 600)
park_2 <- subset(park_2, park_2$time >= 600)
park_3 <- subset(park_3, park_3$time >= 600)
park_4 <- subset(park_4, park_4$time >= 600)
park_5 <- subset(park_5, park_5$time >= 600)


mp1 <- mean(park1$time_in_park)
mp2 <- mean(park2$time_in_park)
mp3 <- mean(park3$time_in_park)
mp4 <- mean(park4$time_in_park)
mp5 <- mean(park5$time_in_park)


m_p1 <- mean(park_1$time_in_park)
m_p2 <- mean(park_2$time_in_park)
m_p3 <- mean(park_3$time_in_park)
m_p4 <- mean(park_4$time_in_park)
m_p5 <- mean(park_5$time_in_park)

pairedpark <- c()
pairedpark <- append(pairedpark, mp1)
pairedpark <- append(pairedpark, mp2)
pairedpark <- append(pairedpark, mp3)
pairedpark <- append(pairedpark, mp4)
pairedpark <- append(pairedpark, mp5)
pairedpark

paired_park <- c()
paired_park <- append(paired_park, m_p1)
paired_park <- append(paired_park, m_p2)
paired_park <- append(paired_park, m_p3)
paired_park <- append(paired_park, m_p4)
paired_park <- append(paired_park, m_p5)
paired_park

park_diff <- pairedpark - paired_park
park_diff


t.test(park_diff)
?t.test

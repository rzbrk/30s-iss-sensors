function checkTimeout () {
    if (control.millis() >= startTime + runMaxSeconds * 1000) {
        runProgram = false
        basic.showIcon(IconNames.Yes)
        serial.writeLine("@END@")
    }
}
serial.onDataReceived(serial.delimiters(Delimiters.NewLine), function () {
    SERIAL_RECEIVED = serial.readUntil(serial.delimiters(Delimiters.NewLine))
    if ("@START@" == SERIAL_RECEIVED.substr(0, 7) && !(runProgram)) {
        serial.writeLine("@START@")
        basic.clearScreen()
        runProgram = true
        startTime = control.millis()
    }
})
let tick = 0
let SERIAL_RECEIVED = ""
let startTime = 0
let runProgram = false
let runMaxSeconds = 0
// runMaxSeconds is the maximum time in seconds the program is allowed to run.
runMaxSeconds = 30
runProgram = false
let counter = 0
let ledCounter = 0
let ledX = 0
let ledY = 0
let testAccelerometer = true
let testMagnetometer = false
let testSCD30 = true
let testSI1145 = false
let testTCS34725 = false
basic.showIcon(IconNames.Asleep)
basic.forever(function () {
    if (runProgram) {
        tick = control.millis()
        serial.writeLine("Loop #" + counter)
        serial.writeLine("  Testing Calliope on-board sensors . . .")
        serial.writeLine("    Temp: " + input.temperature() + " degrees")
        serial.writeLine("    Light Intensity: " + input.lightLevel())
        if (testAccelerometer == true) {
            serial.writeLine("    Acc x: " + input.acceleration(Dimension.X) + " mg")
            serial.writeLine("    Acc y: " + input.acceleration(Dimension.Y) + " mg")
            serial.writeLine("    Acc z: " + input.acceleration(Dimension.Z) + " mg")
            serial.writeLine("    Acc total: " + input.acceleration(Dimension.Strength) + " mg")
        }
        if (testMagnetometer == true) {
            serial.writeLine("    Mag x: " + input.magneticForce(Dimension.X) + " µT")
            serial.writeLine("    Mag y: " + input.magneticForce(Dimension.Y) + " µT")
            serial.writeLine("    Mag z: " + input.magneticForce(Dimension.Z) + " µT")
            serial.writeLine("    Mag total: " + input.magneticForce(Dimension.Strength) + " µT")
        }
        if (testSCD30 == true) {
            serial.writeLine("  Testing SCD30 . . .")
            serial.writeLine("    Sensor version: " + SCD30.getVersion())
            serial.writeLine("    Temp: " + SCD30.readTemperature() + " degrees")
            serial.writeLine("    Humidity: " + SCD30.readHumidity() + " %")
            serial.writeLine("    CO2: " + SCD30.readCO2() + " ppm")
        }
        if (testSI1145 == true) {
            serial.writeLine("  Testing SI1145 . . .")
        }
        if (testTCS34725 == true) {
            serial.writeLine("  Testing TCS34725 . . .")
        }
        while (control.millis() - tick < 1000) {
        	
        }
        ledCounter = counter % 25
        ledX = ledCounter % 5
        ledY = (ledCounter - ledX) / 5
        counter = counter + 1
        led.toggle(ledX, ledY)
        serial.writeLine("")
        checkTimeout()
    }
})

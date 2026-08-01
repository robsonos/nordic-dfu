import XCTest

@testable import NordicDfuPlugin

class NordicDfuTests: XCTestCase {
    func testEcho() {
        // This is an example of a functional test case for a plugin.
        // Use XCTAssert and related functions to verify your tests produce the correct results.

        let value = "Hello, World!"
        XCTAssertEqual(value, "Hello, World!")
    }
}

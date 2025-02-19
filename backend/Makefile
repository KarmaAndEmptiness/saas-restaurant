# Dependency installation target with individual checks
deps:
	@MISSING_PACKAGES=""
	@dpkg -s libssl-dev >/dev/null 2>&1 || MISSING_PACKAGES="$$MISSING_PACKAGES libssl-dev"
	@dpkg -s libboost-all-dev >/dev/null 2>&1 || MISSING_PACKAGES="$$MISSING_PACKAGES libboost-all-dev"
	@dpkg -s nlohmann-json3-dev >/dev/null 2>&1 || MISSING_PACKAGES="$$MISSING_PACKAGES nlohmann-json3-dev"
	@if [ "$$MISSING_PACKAGES" != "" ]; then \
		echo "Installing missing packages: $$MISSING_PACKAGES"; \
		apt-get update && apt-get install -y $$MISSING_PACKAGES; \
	fi

CXX := g++
CXXFLAGS := -std=c++17 -Wall -Wextra -Werror -g -I./include -I/usr/local/include
LDFLAGS := -lpthread -lssl -lcrypto -lboost_system

# 目录结构
SRC_DIR := src
BUILD_DIR := build
BIN_DIR := bin
INCLUDE_DIR := include

# 源文件和目标文件
SRCS := $(shell find $(SRC_DIR) -name '*.cc')
OBJS := $(SRCS:$(SRC_DIR)/%.cc=$(BUILD_DIR)/%.o)
TARGET := $(BIN_DIR)/server

# 确保目录存在
$(shell mkdir -p $(BUILD_DIR) $(BIN_DIR))

# Default target
.DEFAULT_GOAL := $(TARGET)

.PHONY: all clean run

# Separate dependency installation
install_deps: deps

all: install_deps $(TARGET)

$(TARGET): $(OBJS)
	$(CXX) $(OBJS) -o $@ $(LDFLAGS)

$(BUILD_DIR)/%.o: $(SRC_DIR)/%.cc
	@mkdir -p $(dir $@)
	$(CXX) $(CXXFLAGS) -c $< -o $@

clean:
	rm -rf $(BUILD_DIR) $(BIN_DIR)

run: $(TARGET)
	./$(TARGET) 
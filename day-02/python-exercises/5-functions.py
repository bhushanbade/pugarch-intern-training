def calculate_average(numbers):
    total = sum(numbers)
    average = total / len(numbers)
    return average


salaries = [40000, 45000, 50000]

result = calculate_average(salaries)

print("Average:", result)
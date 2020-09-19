# Zenjob Coding Challenge

This is a **coding challenge** intended for **backend engineers**. It holds **three different tasks**, with an additional **stretch goal** if you are feeling adventurous. For finishing Tasks A, B and C with some documentation, you should not need to invest more than **3 hours**. If you want to take a shot at the stretch goal as well, it may take longer than that.

## What this is about

This repository consists of a simplified version of Zenjob's platform, which allows **companies** to order **jobs** consisting of **shifts** that **talents** (workers) can be booked for.

### No bootstrapping needed

To allow you to dive right into it, there is a simplified version of a job service provided, which already contains the following features:

- creating a job with multiple shifts;
- fetching the shifts for a specific job;
- booking a talent to a shift.

Feel free to adjust it as much as you like.

### Product boundary conditions

There are certain boundary conditions defined which **must** be met by the service.

- **jobs** have to have at least one shift. The start date cannot be in the past and the end date should be after the start date;
- **shifts** can only be at most 8 hours long;
- we do not want **talents** to work less than 2 hours a **shift**;
- **talents** are legally not allowed to work consecutive **shifts**, meaning there has to be at least a 6 hours break between **shifts** for the same **talent**.

## Objective

Your job is to extend the existing service so it satisfies the following requirements:

### Task A

**AS** a Company
I want to be able to cancel a job I ordered previously
**AND** if the job gets cancelled all shifts get cancelled as well

### Task B

**AS** a Company
I want to be able to cancel a single shift of a job I ordered previously

### Task C

**AS** a Company
I want to be able to cancel all shifts booked for a specific talent
**AND** if the shifts are cancelled there has to be a new shifts created as a substitute with a new talent

### Stretch goal

**AS** a Company
I want to be able to order a job for specific times rather than for a fixed one

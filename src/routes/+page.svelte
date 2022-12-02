<svelte:head>
	<title>PowerPlay Scoreboard</title>
	<meta name="description" content="better score-board for PowerPlay2022" />
</svelte:head>

<script lang="ts">
	import type {ConeAction} from "$lib/cone-action";
	import type {Pole} from "$lib/pole";
	import {PoleHeight} from "$lib/pole";
	import {Alliance, ConeType} from "../lib/cone";

	let junctions: Pole[][] = [
		[
			{height: PoleHeight.GROUND, coordinates: [0, 0], cones: [], blueConeCount: 0, redConeCount: 0},
			{height: PoleHeight.LOW, coordinates: [0, 1], cones: [], blueConeCount: 0, redConeCount: 0},
			{height: PoleHeight.GROUND, coordinates: [0, 2], cones: [], blueConeCount: 0, redConeCount: 0},
			{height: PoleHeight.LOW, coordinates: [0, 3], cones: [], blueConeCount: 0, redConeCount: 0},
			{height: PoleHeight.GROUND, coordinates: [0, 4], cones: [], blueConeCount: 0, redConeCount: 0},
		],
	];
	let actions: ConeAction[] = [];

	$: {
		console.log("actions", actions);
		updatePole();
		junctions = junctions;
		console.log("0, 0: ", junctions[0][0].cones);
	}

	function addConeToPole(xCoordinate: number, yCoordinate: number, color: Alliance): void {
		console.log("addConeToPole", xCoordinate, yCoordinate);
		// for trigger reactivity
		actions = [...actions, {
			cone: {
				category: ConeType.REGULAR,
				color: color,
				coordinates: [xCoordinate, yCoordinate],
			},
			pole: junctions[yCoordinate][xCoordinate],
		}];
	}

	function undoAction(): void {
		console.log("undoAction");
		actions = actions.slice(0, actions.length - 1);
	}

	function updatePole(): void {
		console.log("updatePole");
		actions.forEach((action, i) => {
			console.log("action i", i);
			let currentPole = structuredClone(junctions[action.pole.coordinates[1]][action.pole.coordinates[0]]);
			if (action.cone.color === Alliance.BLUE) {
				currentPole.blueConeCount++;
			} else {
				currentPole.redConeCount++;
			}
			console.log("currentPole.cones before", currentPole.cones)
			currentPole.cones = [...currentPole.cones, action.cone];
			console.log("currentPole.cones after", currentPole.cones)
			junctions[action.pole.coordinates[1]][action.pole.coordinates[0]] = currentPole;
		});
	}
</script>

<section>
	{#each junctions as junctionRow, i}
		<div>
			<p>Row: {i}</p>
			{#each junctionRow as pole, j}
				<div class="pole">
					<p>
						Coordinates: {pole.coordinates[0]},{pole.coordinates[1]}
						Height: {pole.height}
						Blue: {pole.blueConeCount}
						Red: {pole.redConeCount}
						{#if pole.cones.length > 0}
							{#each pole.cones as cone}
								<span>{cone.color}</span>
							{/each}
						{/if}
						|
						<button on:click={() => addConeToPole(j ,i, Alliance.BLUE)}>Add Blue</button>
						<button on:click={() => addConeToPole(j ,i, Alliance.RED)}>Add Red</button>
					</p>
				</div>
			{/each}
		</div>
	{/each}

	<button on:click={undoAction}>Undo</button>
</section>
